const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');
const sidebar = fs.readFileSync(path.join(root, 'automation', 'SettingsSidebar.html'), 'utf8');

function contains(source, text, label) {
  assert(source.includes(text), `${label} should include: ${text}`);
}

contains(code, 'function runWeeklyLabFullCycle', 'Code.gs');
contains(code, 'function forceRunWeeklyLabFullCycleForToday', 'Code.gs');
contains(code, 'function forceRestartWeeklyLabFullCycleForToday', 'Code.gs');
contains(code, 'function continueWeeklyLabFullCycleForToday', 'Code.gs');
contains(code, 'function rebuildAndContinueWeeklyLabFullCycleFor20260512', '5/12 manual UI recovery helper');
contains(code, 'function continueWeeklyLabFullCycle', 'Code.gs');
contains(code, 'function continueWeeklyLabFullCycleFromReport_', 'Code.gs');
contains(code, 'function rebuildWeeklyLabDraftForExistingReport_', 'existing report rebuild helper');
contains(code, 'function collectAndStoreWeeklyBackData_', 'Code.gs');
contains(code, 'WEEKLY_LAB_MARKET_ETFS', 'market ETF coverage');
contains(code, 'marketDataCollectionTargets_', 'market ETF collection target helper');
contains(code, 'SPY', 'market data should include broad market ETF');
contains(code, 'QQQ', 'market data should include growth ETF');
contains(code, 'SCHD', 'market data should include dividend ETF');
contains(code, 'XLK', 'market data should include technology ETF');
contains(code, 'XLE', 'market data should include energy ETF');
contains(code, 'function collectAndStoreNewsEvents_', 'Code.gs');
contains(code, 'function buildWeeklyScoresFromBackData_', 'Code.gs');
contains(code, 'function createWeeklyLabDraftReportDoc_', 'Code.gs');
contains(code, 'function createVisualizationQueueForReport_', 'Code.gs');
contains(code, 'countIssueDateRowsInSheet_', 'weekly score persistence check');
contains(code, 'weekly_scores 저장 검증 실패', 'weekly score persistence check');
contains(code, 'function findAppendRowByKeyColumns_', 'weekly score append row helper');
contains(code, 'function repairWeeklyScoresLayout', 'weekly score repair helper');
contains(code, 'function deleteIssueDateRows_', 'Code.gs');
contains(code, 'GOOGLEFINANCE', 'market data collection');
contains(code, 'UrlFetchApp.fetch', 'news event collection');
contains(code, "runWeeklyLabFullCycle(issueDate, { triggerSource: 'apps_script_trigger'", 'scheduled trigger');
contains(code, "mode: 'resume'", 'resume mode');
contains(code, "mode: 'restart'", 'restart mode');
contains(code, 'function findLatestWeeklyLabReportForIssueDate_', 'resume should find existing report');
contains(code, 'function reportHasEmailHtmlDraft_', 'resume should detect existing email HTML');
contains(code, 'const existingReport = findLatestWeeklyLabReportForIssueDate_(targetIssueDate)', 'resume should inspect latest report before skipping');
contains(code, '!reportHasEmailHtmlDraft_(existingReport.report_id)', 'resume should continue unfinished reports');
contains(code, 'continueWeeklyLabFullCycleFromReport_(targetIssueDate, runId, existingReport)', 'resume should finish missing email HTML instead of only skipping');
contains(code, '[SSMK continue] start', 'continue function should write visible Apps Script logs');
contains(code, '[SSMK continue] report found', 'continue function should log selected report');
contains(code, '[SSMK continue] email html ready', 'continue function should log HTML URL');
contains(code, '[SSMK continue] finished', 'continue function should log final status');
contains(code, "deleteIssueDateRows_(SSMK.sheets.newsEvents", 'restart should clear same-day news working rows');
contains(code, "deleteIssueDateRows_(SSMK.sheets.hypothesisReviews", 'restart should clear same-day review working rows');
contains(code, 'buildEmailVisualizationHtml_', 'email html should include auto visualizations');

assert(
  !/logAutomationStep_\(\s*runId\s*,\s*0\s*,/.test(code),
  'automation_step_log step_order must always be 1 or higher'
);

assert(
  !code.includes('=ARRAYFORMULA(IF(C2:C='),
  'weekly_scores formulas should not use whole-column array formulas that can hide append/write failures'
);

contains(code, "row[13] === '#REF!'", 'weekly_scores formula repair should replace legacy #REF cells');

assert(
  !/function scheduledWeeklyLabTrigger\(\) \{[\s\S]*?runWeeklyLabWorkflow\(issueDate\)/.test(code),
  'scheduledWeeklyLabTrigger should call the full cycle, not only the old report workflow'
);

contains(code, 'function createWeeklyLabDraftReportDoc_', 'Code.gs');
contains(code, 'function collectWeeklyLabReportContext_', 'Code.gs');
contains(code, 'function buildWeeklyLabReportSectionModels_', 'Code.gs');
contains(code, 'function runWeeklyLabReportQualityGate_', 'Code.gs');
contains(code, 'function renderWeeklyLabDocsDraft_', 'Code.gs');
contains(code, 'function renderWeeklyLabEmailHtml_', 'Code.gs');
contains(code, "SSMK.sheets.reportBlueprint", 'report blueprint sheet contract');
contains(code, 'function runPublishQualityGate_', 'Sage publish QC gate');
contains(code, 'function recordPublishQualityGateReview_', 'publish QC log writer');
contains(code, 'function getLatestPublishQualityGateReview_', 'latest publish QC lookup');
contains(code, 'runPublishQualityGate_', 'email HTML flow should call publish QC');

assert(
  !code.includes("startAutomationRun_('weekly_lab_full_cycle', 'tuesday_weekly_report'"),
  'full cycle should use a neutral schedule key helper, not hardcoded tuesday_weekly_report'
);

contains(sidebar, '오늘 전체 사이클 실행', 'Control Center force run button');
contains(sidebar, '처음부터 다시 실행', 'Control Center restart button');
contains(sidebar, "runServer('forceRunWeeklyLabFullCycleForToday'", 'Control Center force run handler');
contains(sidebar, "runServer('forceRestartWeeklyLabFullCycleForToday'", 'Control Center restart handler');

function extractTopLevelFunction(source, functionName) {
  const start = source.indexOf(`function ${functionName}`);
  assert(start >= 0, `${functionName} should exist`);
  const bodyStart = source.indexOf('{', start);
  assert(bodyStart >= 0, `${functionName} should have a body`);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`${functionName} body should close`);
}

function extractConstArray(source, constName) {
  const start = source.indexOf(`const ${constName} = [`);
  assert(start >= 0, `${constName} should exist`);
  const end = source.indexOf('];', start);
  assert(end >= 0, `${constName} should close`);
  return source.slice(start, end + 2);
}

const marketTargetApi = new Function(`
${extractConstArray(code, 'WEEKLY_LAB_MARKET_ETFS')}
${extractTopLevelFunction(code, 'marketDataCollectionTargets_')}
return { WEEKLY_LAB_MARKET_ETFS, marketDataCollectionTargets_ };
`)();

const coreEtfTickers = ['SPY', 'QQQ', 'SCHD', 'XLK', 'XLE'];
const marketTargets = marketTargetApi.marketDataCollectionTargets_([
  { ticker: 'msft', company: 'Microsoft', asset_type: 'equity' },
  { ticker: 'QQQ', company: 'Watchlist QQQ placeholder', asset_type: 'equity' },
]);
const marketTargetsByTicker = new Map(marketTargets.map((item) => [item.ticker, item]));

coreEtfTickers.forEach((ticker) => {
  assert(marketTargetsByTicker.has(ticker), `${ticker} should always be collected for market context`);
  assert.strictEqual(
    marketTargetsByTicker.get(ticker).asset_type,
    'etf',
    `${ticker} should be marked as ETF even when it already exists in the watchlist`
  );
  assert.strictEqual(
    marketTargets.filter((item) => item.ticker === ticker).length,
    1,
    `${ticker} should be collected only once`
  );
});

assert.strictEqual(
  marketTargetApi.WEEKLY_LAB_MARKET_ETFS.length,
  coreEtfTickers.length,
  'core ETF count should stay aligned with the expected Market Map and Dividend/ETF set'
);

console.log('weekly full cycle contract ok');
