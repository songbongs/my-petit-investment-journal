const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');

function contains(source, text, label) {
  assert(source.includes(text), `${label} should include: ${text}`);
}

function functionBody(source, functionName) {
  const marker = `function ${functionName}`;
  const start = source.indexOf(marker);
  assert(start >= 0, `Missing function: ${functionName}`);
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, index);
  }
  throw new Error(`Could not parse body for ${functionName}`);
}

contains(code, "reportFactCards: 'report_fact_cards'", 'SSMK.sheets');
contains(code, 'reportFactCards: [', 'SSMK.headers');
[
  'fact_id',
  'issue_date',
  'report_id',
  'section_key',
  'ticker',
  'fact_type',
  'metric_name',
  'period',
  'value',
  'unit',
  'source_key',
  'data_confidence',
  'data_status',
  'missing_reason',
].forEach((header) => contains(code, `'${header}'`, `report_fact_cards header ${header}`));

contains(code, 'function buildReportFactCards_', 'fact card helper');
contains(code, 'function buildMarketFactCards_', 'market fact card helper');
contains(code, 'function buildScoreFactCards_', 'score fact card helper');
contains(code, 'function missingFactCard_', 'missing data fact helper');
contains(code, 'function replaceReportFactCardsForReport_', 'fact card persistence helper');
contains(code, 'report_fact_cards', 'setup should know report_fact_cards');

const draftReportBody = functionBody(code, 'createWeeklyLabDraftReportDoc_');
contains(draftReportBody, 'buildReportFactCards_', 'draft report should build fact cards from the report context');
contains(draftReportBody, 'replaceReportFactCardsForReport_', 'draft report should persist fact cards for the report id');

console.log('report fact cards contract ok');
