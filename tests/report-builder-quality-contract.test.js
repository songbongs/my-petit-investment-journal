const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');

function contains(source, text, label) {
  assert(source.includes(text), `${label} should include: ${text}`);
}

function notContains(source, text, label) {
  assert(!source.includes(text), `${label} should not include: ${text}`);
}

function functionBody(source, functionName) {
  const marker = `function ${functionName}`;
  const start = source.indexOf(marker);
  assert(start >= 0, `Missing function: ${functionName}`);
  const braceStart = source.indexOf('{', start);
  assert(braceStart >= 0, `Missing opening brace for ${functionName}`);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) {
      return source.slice(braceStart + 1, index);
    }
  }
  throw new Error(`Could not parse body for ${functionName}`);
}

const requiredSectionKeys = [
  'executive_dashboard',
  'market_map',
  'industry_theme_board',
  'stock_dashboard',
  'lens_deep_dive',
  'hypothesis_lab',
  'forecast_vs_actual',
  'dividend_etf_corner',
  'hypothesis_evolution_log',
  'learning_notes',
  'sources_limitations',
  'agent_review_board',
];

contains(code, "reportBlueprint: 'report_blueprint'", 'SSMK.sheets');
contains(code, 'reportBlueprint: [', 'SSMK.headers');
contains(code, 'DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT', 'Code.gs');
contains(code, 'function seedDefaultReportBlueprint_', 'Code.gs');
contains(code, 'function collectWeeklyLabReportContext_', 'Code.gs');
contains(code, 'function buildWeeklyLabReportSectionModels_', 'Code.gs');
contains(code, 'function runWeeklyLabReportQualityGate_', 'Code.gs');
contains(code, 'function renderWeeklyLabDocsDraft_', 'Code.gs');
contains(code, 'function renderWeeklyLabEmailHtml_', 'Code.gs');
contains(code, 'function getWeeklyLabScheduleKey_', 'Code.gs');
contains(code, 'WEEKLY_LAB_PRIMARY_SCHEDULE_KEY', 'Code.gs');
contains(code, 'WEEKLY_LAB_LEGACY_SCHEDULE_KEY', 'Code.gs');
contains(code, "SSMK_SETUP_BUILD = '2026-05-06-report-builder-blueprint-v2'", 'setup build marker');
contains(code, "status: hasUsableContent ? 'draft' : 'needs_revision'", 'missing data should not force revision status');
notContains(code, "status: missingData ? 'needs_revision' : 'draft'", 'section status should separate data gaps from revision needs');
contains(code, '데이터 한계 표시됨', 'quality gate warning language');
notContains(code, "if (status === 'draft') score -= 3", 'operator QA should not punish expected draft status');

requiredSectionKeys.forEach((sectionKey) => {
  contains(code, sectionKey, `required section key ${sectionKey}`);
});

const draftReportBody = functionBody(code, 'createWeeklyLabDraftReportDoc_');
contains(draftReportBody, 'collectWeeklyLabReportContext_', 'draft report creation');
contains(draftReportBody, 'buildWeeklyLabReportSectionModels_', 'draft report creation');
contains(draftReportBody, 'runWeeklyLabReportQualityGate_', 'draft report creation');
contains(draftReportBody, 'renderWeeklyLabDocsDraft_', 'draft report creation');

const oldBuilderBody = code.includes('function buildWeeklyLabDraftReportText_')
  ? functionBody(code, 'buildWeeklyLabDraftReportText_')
  : '';
notContains(oldBuilderBody, '## 1. 이번 주 3줄 요약', 'old hardcoded report builder');
notContains(oldBuilderBody, '## 2. 관찰 우선순위', 'old hardcoded report builder');
notContains(oldBuilderBody, '## 3. 이번 주 AI 가설', 'old hardcoded report builder');

notContains(code, '를 통해 관찰 우선순위를 확인합니다.', 'generated default language');

const emailBody = functionBody(code, 'buildEmailFinalReportHtml_');
notContains(emailBody, 'QA 상태', 'learner-facing email html');
notContains(emailBody, 'blocked', 'learner-facing email html');
notContains(emailBody, 'error_log', 'learner-facing email html');
notContains(emailBody, 'bottleneck_log', 'learner-facing email html');
notContains(emailBody, '발행 전 체크리스트', 'learner-facing email html');
notContains(emailBody, '상태:', 'learner-facing email html section rendering');

const scheduleBody = functionBody(code, 'getWeeklyLabScheduleConfig_');
contains(scheduleBody, 'getWeeklyLabScheduleRow_', 'schedule config');
notContains(scheduleBody, "getScheduleRow_('tuesday_weekly_report')", 'schedule config');

console.log('report builder quality contract ok');
