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
contains(code, 'function collectAndStoreWeeklyBackData_', 'Code.gs');
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

contains(sidebar, '오늘 전체 사이클 실행', 'Control Center force run button');
contains(sidebar, '처음부터 다시 실행', 'Control Center restart button');
contains(sidebar, "runServer('forceRunWeeklyLabFullCycleForToday'", 'Control Center force run handler');
contains(sidebar, "runServer('forceRestartWeeklyLabFullCycleForToday'", 'Control Center restart handler');

console.log('weekly full cycle contract ok');
