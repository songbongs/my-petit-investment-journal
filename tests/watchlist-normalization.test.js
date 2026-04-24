const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'automation', 'Code.gs'), 'utf8');

function loadApi() {
  const context = {
    console,
    Logger: { log() {} },
    SpreadsheetApp: { flush() {} },
  };
  vm.createContext(context);
  vm.runInContext(`${code}\nthis.__api = { SSMK, normalizeWatchlistColumns_ };`, context);
  return context.__api;
}

class FakeRange {
  constructor(sheet, row, column, rowCount, columnCount) {
    this.sheet = sheet;
    this.row = row;
    this.column = column;
    this.rowCount = rowCount;
    this.columnCount = columnCount;
  }

  getValues() {
    return this.sheet.read(this.row, this.column, this.rowCount, this.columnCount);
  }

  getDisplayValues() {
    return this.getValues().map((row) => row.map((cell) => String(cell || '')));
  }

  setValues(values) {
    this.sheet.write(this.row, this.column, values);
    return this;
  }

  setFontWeight() { return this; }
  setFontColor() { return this; }
  setBackground() { return this; }
}

class FakeSheet {
  constructor(rows) {
    this.rows = rows.map((row) => row.slice());
    this.insertCalls = [];
  }

  getRange(row, column, rowCount, columnCount) {
    return new FakeRange(this, row, column, rowCount, columnCount);
  }

  getLastColumn() {
    return Math.max(...this.rows.map((row) => row.length), 1);
  }

  getLastRow() {
    return this.rows.length;
  }

  getMaxColumns() {
    return this.getLastColumn();
  }

  insertColumnsAfter(column, howMany) {
    this.insertCalls.push({ column, howMany });
    this.rows.forEach((row) => {
      while (row.length < column) row.push('');
      row.splice(column, 0, ...Array(howMany).fill(''));
    });
  }

  setFrozenRows() {}
  autoResizeColumns() {}

  read(row, column, rowCount, columnCount) {
    return Array.from({ length: rowCount }, (_, rowOffset) => {
      const sourceRow = this.rows[row + rowOffset - 1] || [];
      return Array.from({ length: columnCount }, (_, columnOffset) => {
        const value = sourceRow[column + columnOffset - 1];
        return value === undefined || value === null ? '' : value;
      });
    });
  }

  write(row, column, values) {
    values.forEach((sourceRow, rowOffset) => {
      const targetRowIndex = row + rowOffset - 1;
      while (this.rows.length <= targetRowIndex) this.rows.push([]);
      const targetRow = this.rows[targetRowIndex];
      sourceRow.forEach((value, columnOffset) => {
        targetRow[column + columnOffset - 1] = value;
      });
    });
  }
}

class FakeSpreadsheet {
  constructor(sheetName, rows) {
    this.sheetName = sheetName;
    this.sheet = new FakeSheet(rows);
  }

  getSheetByName(sheetName) {
    return sheetName === this.sheetName ? this.sheet : null;
  }

  insertSheet(sheetName) {
    if (sheetName !== this.sheetName) throw new Error(`Unexpected sheet insert: ${sheetName}`);
    this.sheet = new FakeSheet([[]]);
    return this.sheet;
  }
}

function normalizeRows(rows) {
  const api = loadApi();
  const ss = new FakeSpreadsheet(api.SSMK.sheets.watchlist, rows);
  api.normalizeWatchlistColumns_(ss);
  return { rows: ss.sheet.rows, insertCalls: ss.sheet.insertCalls };
}

function watchlistHeaders() {
  return Array.from(loadApi().SSMK.headers.watchlist);
}

function assertNoMiddleInsert(insertCalls) {
  assert.deepStrictEqual(
    insertCalls.filter((call) => call.column < 12),
    [],
    'watchlist normalization must not insert columns in the middle of existing data'
  );
}

function testPreservesDataWhenOnlyInvestmentStyleIsMissing() {
  const { rows, insertCalls } = normalizeRows([
    [
      'ticker',
      'company',
      'core_industry',
      'theme_tags',
      'role_in_watchlist',
      'tracking_priority',
      'dividend_focus',
      'business_model_focus',
      'key_metrics_to_watch',
      'main_events_to_watch',
      'active',
      'notes',
    ],
    [
      'MSFT',
      'Microsoft',
      'AI/Cloud',
      'AI, cloud',
      'Anchor',
      'High',
      'No',
      'Cloud platform',
      'Revenue growth',
      'Earnings',
      'TRUE',
      'Keep watching source freshness',
    ],
  ]);

  assertNoMiddleInsert(insertCalls);
  assert.deepStrictEqual(rows[0].slice(0, 13), watchlistHeaders());
  assert.deepStrictEqual(rows[1].slice(0, 13), [
    'MSFT',
    'Microsoft',
    'AI/Cloud',
    'AI, cloud',
    '',
    'Anchor',
    'High',
    'No',
    'Cloud platform',
    'Revenue growth',
    'Earnings',
    'TRUE',
    'Keep watching source freshness',
  ]);
}

function testPreservesDataWhenOnlyThemeTagsIsMissing() {
  const { rows, insertCalls } = normalizeRows([
    [
      'ticker',
      'company',
      'core_industry',
      'investment_style',
      'role_in_watchlist',
      'tracking_priority',
      'dividend_focus',
      'business_model_focus',
      'key_metrics_to_watch',
      'main_events_to_watch',
      'active',
      'notes',
    ],
    [
      'JNJ',
      'Johnson & Johnson',
      'Healthcare',
      'Defensive',
      'Dividend study',
      'Medium',
      'Yes',
      'Pharma and devices',
      'FCF coverage',
      'Pipeline update',
      'TRUE',
      'Check official filings',
    ],
  ]);

  assertNoMiddleInsert(insertCalls);
  assert.deepStrictEqual(rows[0].slice(0, 13), watchlistHeaders());
  assert.deepStrictEqual(rows[1].slice(0, 13), [
    'JNJ',
    'Johnson & Johnson',
    'Healthcare',
    '',
    'Defensive',
    'Dividend study',
    'Medium',
    'Yes',
    'Pharma and devices',
    'FCF coverage',
    'Pipeline update',
    'TRUE',
    'Check official filings',
  ]);
}

function testPreservesFalseLikeCellValues() {
  const { rows } = normalizeRows([
    [
      'ticker',
      'company',
      'core_industry',
      'investment_style',
      'role_in_watchlist',
      'tracking_priority',
      'dividend_focus',
      'business_model_focus',
      'key_metrics_to_watch',
      'main_events_to_watch',
      'active',
      'notes',
    ],
    [
      'GM',
      'General Motors',
      'Auto',
      'Turnaround',
      'Cyclical study',
      'Low',
      false,
      'Auto manufacturing',
      'Margin',
      'Deliveries',
      false,
      'Boolean cells should stay boolean values',
    ],
  ]);

  assert.strictEqual(rows[1][7], false);
  assert.strictEqual(rows[1][11], false);
}

testPreservesDataWhenOnlyInvestmentStyleIsMissing();
testPreservesDataWhenOnlyThemeTagsIsMissing();
testPreservesFalseLikeCellValues();
console.log('watchlist normalization tests passed');
