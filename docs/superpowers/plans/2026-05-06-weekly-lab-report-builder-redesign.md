# Weekly Lab Report Builder Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the brittle 5-section Weekly Lab draft generator with a blueprint-driven report builder that keeps Docs drafts, email HTML, scheduling, and QA gates aligned with the SSMK learning-system rules.

**Architecture:** Add a `report_blueprint` sheet as the Apps Script-readable report contract, collect one shared report context per run, build section models from that context, run one quality gate, and render Docs/HTML from the same section models. Keep the legacy `tuesday_weekly_report` schedule key as a fallback while introducing a neutral `weekly_lab_primary_schedule` key.

**Tech Stack:** Google Apps Script in `automation/Code.gs`, Google Sheets tabs as storage/config, plain Node.js `assert` contract tests, Markdown documentation.

---

## File Structure

**Modify:**

- `automation/Code.gs`
  - Add `report_blueprint` sheet/header/default rows.
  - Add neutral schedule key helpers.
  - Add report context, section model, renderer, and quality gate helpers.
  - Replace the old hardcoded `buildWeeklyLabDraftReportText_()` output path.
  - Remove operations-only text from learner-facing email HTML.
- `tests/weekly-full-cycle-contract.test.js`
  - Extend existing full-cycle contract checks.
- `docs/operations/weekly-lab-runbook.md`
  - Explain `report_blueprint`, schedule settings, and minimal verification.
- `automation/google-apps-script-plan.md`
  - Update the implementation plan notes so future maintainers do not rely on the old 5-section builder.
- `automation/ai-report-generation-workflow.md`
  - Update the workflow description to match context/model/QA/render separation.

**Create:**

- `tests/report-builder-quality-contract.test.js`
  - Dedicated contract test for report blueprint, forbidden phrase removal, output split, and schedule neutrality.

---

## Task 1: Add Failing Report Builder Contract Tests

**Files:**

- Create: `tests/report-builder-quality-contract.test.js`
- Modify: `tests/weekly-full-cycle-contract.test.js`

- [ ] **Step 1: Create the failing quality contract test**

Create `tests/report-builder-quality-contract.test.js` with this content:

```javascript
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
```

- [ ] **Step 2: Extend the full-cycle contract test**

In `tests/weekly-full-cycle-contract.test.js`, add these checks before `console.log('weekly full cycle contract ok');`:

```javascript
contains(code, 'function createWeeklyLabDraftReportDoc_', 'Code.gs');
contains(code, 'function collectWeeklyLabReportContext_', 'Code.gs');
contains(code, 'function buildWeeklyLabReportSectionModels_', 'Code.gs');
contains(code, 'function runWeeklyLabReportQualityGate_', 'Code.gs');
contains(code, 'function renderWeeklyLabDocsDraft_', 'Code.gs');
contains(code, 'function renderWeeklyLabEmailHtml_', 'Code.gs');
contains(code, "SSMK.sheets.reportBlueprint", 'report blueprint sheet contract');

assert(
  !code.includes("startAutomationRun_('weekly_lab_full_cycle', 'tuesday_weekly_report'"),
  'full cycle should use a neutral schedule key helper, not hardcoded tuesday_weekly_report'
);
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
node tests/weekly-full-cycle-contract.test.js
node tests/report-builder-quality-contract.test.js
```

Expected:

```text
tests/weekly-full-cycle-contract.test.js fails because neutral schedule helper/report builder hooks do not exist yet.
tests/report-builder-quality-contract.test.js fails because report_blueprint, report models, quality gate, output split, and forbidden language removal do not exist yet.
```

- [ ] **Step 4: Commit the failing tests**

```bash
git add tests/weekly-full-cycle-contract.test.js tests/report-builder-quality-contract.test.js
git commit -m "test: capture weekly lab report builder contract"
```

---

## Task 2: Add Report Blueprint Schema and Seed Data

**Files:**

- Modify: `automation/Code.gs`
- Test: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Add sheet and header constants**

In `automation/Code.gs`, update `SSMK.sheets`:

```javascript
    reportBlueprint: 'report_blueprint',
```

Add `SSMK.headers.reportBlueprint`:

```javascript
    reportBlueprint: [
      'section_key',
      'section_order',
      'section_title',
      'required',
      'enabled',
      'docs_output',
      'email_output',
      'data_sources',
      'quality_rule',
      'beginner_purpose',
      'notes',
    ],
```

- [ ] **Step 2: Add default blueprint rows**

Near the control-center defaults, add:

```javascript
const DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT = [
  {
    section_key: 'executive_dashboard',
    section_order: 1,
    section_title: 'Executive Dashboard',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; market_data; visualization_queue',
    quality_rule: 'must_have_actual_change_and_learning_question',
    beginner_purpose: '이번 주 전체 그림과 핵심 질문을 먼저 잡습니다.',
    notes: '점수는 투자 판단이 아니라 관찰 우선순위입니다.',
  },
  {
    section_key: 'market_map',
    section_order: 2,
    section_title: 'Market Map',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'market_data',
    quality_rule: 'must_explain_market_direction_without_recommendation',
    beginner_purpose: '개별 종목 전에 시장 바람의 방향을 봅니다.',
    notes: 'SPY, QQQ, SCHD, XLK, XLE가 있으면 우선 사용합니다.',
  },
  {
    section_key: 'industry_theme_board',
    section_order: 3,
    section_title: 'Industry & Theme Board',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; sector_theme_scores; watchlist',
    quality_rule: 'must_separate_industry_theme_style',
    beginner_purpose: '산업, 테마, 투자 성격을 섞지 않고 구분합니다.',
    notes: '산업은 돈 버는 본업, 테마는 시장의 관심 이야기입니다.',
  },
  {
    section_key: 'stock_dashboard',
    section_order: 4,
    section_title: 'SSMK Stock Dashboard',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; market_data',
    quality_rule: 'must_show_score_as_question_selector',
    beginner_purpose: '총점보다 왜 이번 주에 볼 만한지 확인합니다.',
    notes: 'Top N은 설정값을 사용합니다.',
  },
  {
    section_key: 'lens_deep_dive',
    section_order: 5,
    section_title: 'SSMK Lens Deep Dive',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; watchlist; company_fundamentals; shareholder_returns',
    quality_rule: 'must_include_missing_data_when_facts_absent',
    beginner_purpose: '종목 하나를 SSMK 렌즈로 천천히 해부합니다.',
    notes: '데이터가 부족하면 부족하다고 씁니다.',
  },
  {
    section_key: 'hypothesis_lab',
    section_order: 6,
    section_title: 'Hypothesis Lab',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'hypothesis_lab; weekly_scores; news_events',
    quality_rule: 'must_have_hypothesis_evidence_lesson_limit',
    beginner_purpose: '이번 주 핵심 가설을 다음 확인 질문으로 바꿉니다.',
    notes: '가설은 정답이 아니라 복기할 질문입니다.',
  },
  {
    section_key: 'forecast_vs_actual',
    section_order: 7,
    section_title: 'Forecast vs Actual',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'hypothesis_reviews; weekly_scores',
    quality_rule: 'must_show_review_status_or_missing_review',
    beginner_purpose: '지난 가설이 실제 흐름과 어떻게 달랐는지 봅니다.',
    notes: '복기할 데이터가 없으면 아직 복기 전이라고 씁니다.',
  },
  {
    section_key: 'dividend_etf_corner',
    section_order: 8,
    section_title: 'Dividend & ETF Corner',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'shareholder_returns; etf_watch; weekly_scores',
    quality_rule: 'must_explain_dividend_etf_as_learning_not_recommendation',
    beginner_purpose: '배당과 ETF를 수익률 숫자만으로 보지 않는 연습을 합니다.',
    notes: '데이터가 부족하면 배당/ETF 보강 필요를 남깁니다.',
  },
  {
    section_key: 'hypothesis_evolution_log',
    section_order: 9,
    section_title: 'Hypothesis Evolution Log',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'FALSE',
    data_sources: 'hypothesis_evolution_log; report_versions',
    quality_rule: 'must_track_change_or_state_missing',
    beginner_purpose: '가설이 시간이 지나며 어떻게 바뀌었는지 기록합니다.',
    notes: '편집자용 흐름이라 이메일에서는 기본 제외합니다.',
  },
  {
    section_key: 'learning_notes',
    section_order: 10,
    section_title: 'Learning Notes',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; qa_review_log',
    quality_rule: 'must_end_with_beginner_lesson',
    beginner_purpose: '이번 주에 배운 개념을 쉬운 말로 정리합니다.',
    notes: '일반론만 쓰지 않고 이번 주 데이터와 연결합니다.',
  },
  {
    section_key: 'sources_limitations',
    section_order: 11,
    section_title: 'Sources & Limitations',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'data_sources; source_policy; weekly_scores',
    quality_rule: 'must_name_missing_data',
    beginner_purpose: '무엇을 알고 무엇을 아직 모르는지 구분합니다.',
    notes: '부족한 데이터는 실패가 아니라 다음 확인 질문입니다.',
  },
  {
    section_key: 'agent_review_board',
    section_order: 12,
    section_title: 'Agent Review Board',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'FALSE',
    data_sources: 'agent_review_log; qa_review_log',
    quality_rule: 'must_keep_operations_out_of_email',
    beginner_purpose: '운영자가 초안 품질과 차단 이슈를 확인합니다.',
    notes: '운영용 섹션이라 이메일에서는 기본 제외합니다.',
  },
];
```

- [ ] **Step 3: Add reportBlueprint to schema groups**

In `WORKBOOK_SCHEMA_SHEET_GROUPS`, add `reportBlueprint` near `reportSections`:

```javascript
    'reportBlueprint',
    'reportSections',
```

- [ ] **Step 4: Seed default blueprint rows**

Add this function near `seedDefaultSchedules_()`:

```javascript
function seedDefaultReportBlueprint_(ss) {
  const existing = new Set(readObjects_(SSMK.sheets.reportBlueprint).map((row) => row.section_key));
  DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT.forEach((section) => {
    if (!existing.has(section.section_key)) {
      appendObject_(SSMK.sheets.reportBlueprint, SSMK.headers.reportBlueprint, section);
    }
  });
}
```

Call it at the end of `prepareSsmkWorkbook_()` after `ensureWorkbookSchemaSheets_()`:

```javascript
  seedDefaultReportBlueprint_(ss);
  logSetupProgress_('report blueprint ready', normalizedOptions.logProgress);
```

- [ ] **Step 5: Add dropdowns for blueprint boolean columns**

In `applyDropdowns_(ss)`, add:

```javascript
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 4, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 5, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 6, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 7, SSMK.dropdowns.yesNo);
```

- [ ] **Step 6: Run focused tests**

Run:

```bash
node tests/report-builder-quality-contract.test.js
```

Expected:

```text
Still fails because report context, section models, quality gate, renderers, schedule helpers, and forbidden phrase removal are not implemented yet.
```

- [ ] **Step 7: Commit schema changes**

```bash
git add automation/Code.gs
git commit -m "feat: seed weekly lab report blueprint"
```

---

## Task 3: Neutralize Weekly Lab Schedule Keys

**Files:**

- Modify: `automation/Code.gs`
- Test: `tests/report-builder-quality-contract.test.js`
- Test: `tests/weekly-full-cycle-contract.test.js`

- [ ] **Step 1: Add neutral schedule constants**

Near the default schedule constants, add:

```javascript
const WEEKLY_LAB_PRIMARY_SCHEDULE_KEY = 'weekly_lab_primary_schedule';
const WEEKLY_LAB_LEGACY_SCHEDULE_KEY = 'tuesday_weekly_report';
```

- [ ] **Step 2: Add neutral default schedule**

In `CONTROL_CENTER_DEFAULT_SCHEDULES`, add this row before the legacy `tuesday_weekly_report` row:

```javascript
  {
    schedule_key: WEEKLY_LAB_PRIMARY_SCHEDULE_KEY,
    description: 'Weekly Lab 정기 초안 생성',
    enabled: 'ON',
    cadence: 'weekly_configured',
    last_run_at: '',
    next_run_hint: '설정값 기준',
  },
```

Keep the existing `tuesday_weekly_report` row for compatibility. Change its enabled value to `OFF` only if the implementation also migrates live sheet data; otherwise leave it as-is and rely on the primary key lookup order.

- [ ] **Step 3: Add schedule lookup helpers**

Replace direct `getScheduleRow_('tuesday_weekly_report')` usage in Weekly Lab scheduling with these helpers:

```javascript
function getWeeklyLabScheduleKey_() {
  const primary = getScheduleRow_(WEEKLY_LAB_PRIMARY_SCHEDULE_KEY);
  if (primary) return WEEKLY_LAB_PRIMARY_SCHEDULE_KEY;
  return WEEKLY_LAB_LEGACY_SCHEDULE_KEY;
}

function getWeeklyLabScheduleRow_() {
  return getScheduleRow_(getWeeklyLabScheduleKey_()) || {};
}

function updateWeeklyLabScheduleMetadata_(metadata) {
  updateScheduleMetadata_(getWeeklyLabScheduleKey_(), metadata);
}
```

- [ ] **Step 4: Update schedule config and full cycle start**

Change `getWeeklyLabScheduleConfig_()` to:

```javascript
function getWeeklyLabScheduleConfig_() {
  const schedule = getWeeklyLabScheduleRow_();
  const runDay = String(getPreferenceValue_('weekly_lab_run_day', 'TUESDAY')).trim().toUpperCase();
  const runHour = Number(getPreferenceValue_('weekly_lab_run_hour', 8));

  return {
    scheduleKey: getWeeklyLabScheduleKey_(),
    enabled: normalizeOnOffText_(schedule.enabled || 'ON') || 'ON',
    runDay: toValidWeekDayText_(runDay),
    runHour: Math.max(0, Math.min(23, Number.isNaN(runHour) ? 8 : Math.round(runHour))),
  };
}
```

In `scheduledWeeklyLabTrigger()`, replace `tuesday_weekly_report` references with `config.scheduleKey` and `updateWeeklyLabScheduleMetadata_({ last_run_at: nowText_() })`.

In `runWeeklyLabFullCycle(issueDate, options)`, start the automation run with `getWeeklyLabScheduleKey_()`:

```javascript
  const runId = startAutomationRun_('weekly_lab_full_cycle', getWeeklyLabScheduleKey_(), normalizedOptions.triggerSource);
```

In `runWeeklyLabWorkflow(issueDate)`, start the run with `getWeeklyLabScheduleKey_()` for consistency.

- [ ] **Step 5: Run schedule-related tests**

Run:

```bash
node tests/weekly-full-cycle-contract.test.js
node tests/report-builder-quality-contract.test.js
```

Expected:

```text
Schedule hardcoding assertions pass.
Remaining failures are report context, section models, quality gate, renderers, and forbidden language removal.
```

- [ ] **Step 6: Commit schedule helper changes**

```bash
git add automation/Code.gs tests/weekly-full-cycle-contract.test.js
git commit -m "fix: use neutral weekly lab schedule key"
```

---

## Task 4: Replace Bad Generated Hypothesis Defaults

**Files:**

- Modify: `automation/Code.gs`
- Test: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Add a safer starter hypothesis helper**

Add near `buildWeeklyScoresFromBackData_()`:

```javascript
function buildStarterHypothesisSummary_(watchlistItem, marketRow) {
  const symbol = String(watchlistItem.ticker || '').trim().toUpperCase();
  const company = watchlistItem.company || symbol || '이 종목';
  const change1w = marketRow && marketRow.change_pct_1w !== '' ? `${roundTo2_(marketRow.change_pct_1w)}%` : '';
  const change4w = marketRow && marketRow.change_pct_4w !== '' ? `${roundTo2_(marketRow.change_pct_4w)}%` : '';
  const metricText = watchlistItem.key_metrics_to_watch || '가격 변화, 거래량, 실적 발표, 주요 이벤트';

  if (change1w || change4w) {
    const changeText = [
      change1w ? `1주 가격 변화 ${change1w}` : '',
      change4w ? `4주 가격 변화 ${change4w}` : '',
    ].filter(Boolean).join(', ');
    return `${company}은 이번 주 ${changeText}를 먼저 확인합니다. 이 변화가 실제 사업 흐름인지, 아니면 단기 가격 움직임인지 구분하려면 ${metricText}를 다음 확인 질문으로 남깁니다.`;
  }

  return `${company}은 이번 자동 수집에서 가격 변화 데이터가 충분하지 않습니다. 이번 주에는 ${metricText}가 왜 필요한지 정리하고, 다음 실행에서 가격, 뉴스, 실적 자료가 채워지는지 확인합니다.`;
}
```

- [ ] **Step 2: Pass market data into weekly score generation**

Inside `buildWeeklyScoresFromBackData_()`, build a map before looping:

```javascript
  const marketBySymbol = new Map(readObjects_(SSMK.sheets.marketData)
    .filter((row) => sameDateText_(row.market_date, targetIssueDate))
    .map((row) => [String(row.symbol || '').trim().toUpperCase(), row]));
```

Then replace the old `hypothesis_summary` row value:

```javascript
      buildStarterHypothesisSummary_(item, marketBySymbol.get(symbol)),
```

Remove the old phrase:

```javascript
`${item.company || symbol}은 이번 주 ${item.key_metrics_to_watch || '핵심 지표'}를 통해 관찰 우선순위를 확인합니다.`
```

- [ ] **Step 3: Run forbidden phrase test**

Run:

```bash
node tests/report-builder-quality-contract.test.js
```

Expected:

```text
The generated default language assertion passes.
Remaining failures are report context, section models, quality gate, and renderers.
```

- [ ] **Step 4: Commit generated language change**

```bash
git add automation/Code.gs
git commit -m "fix: remove empty priority hypothesis wording"
```

---

## Task 5: Build Shared Report Context and Section Models

**Files:**

- Modify: `automation/Code.gs`
- Test: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Add blueprint readers**

Add near helper functions:

```javascript
function isTruthyText_(value) {
  return ['TRUE', 'ON', 'YES', '1'].indexOf(String(value || '').trim().toUpperCase()) !== -1;
}

function readWeeklyLabReportBlueprint_() {
  const rows = readObjects_(SSMK.sheets.reportBlueprint);
  const sourceRows = rows.length > 0 ? rows : DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT;
  return sourceRows
    .filter((row) => isTruthyText_(row.enabled))
    .map((row) => ({
      section_key: String(row.section_key || '').trim(),
      section_order: Number(row.section_order || 999),
      section_title: String(row.section_title || row.section_key || '').trim(),
      required: isTruthyText_(row.required),
      enabled: isTruthyText_(row.enabled),
      docs_output: isTruthyText_(row.docs_output),
      email_output: isTruthyText_(row.email_output),
      data_sources: String(row.data_sources || '').trim(),
      quality_rule: String(row.quality_rule || '').trim(),
      beginner_purpose: String(row.beginner_purpose || '').trim(),
      notes: String(row.notes || '').trim(),
    }))
    .filter((row) => row.section_key)
    .sort((a, b) => a.section_order - b.section_order);
}
```

- [ ] **Step 2: Add shared context collector**

Add:

```javascript
function collectWeeklyLabReportContext_(issueDate, reportId, runId) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  return {
    run_id: String(runId || '').trim(),
    report_id: String(reportId || '').trim(),
    issue_date: targetIssueDate,
    week_start: addDaysText_(targetIssueDate, -6),
    generated_at: nowText_(),
    settings: readObjects_(SSMK.sheets.settings),
    preferences: readObjects_(SSMK.sheets.userPreferences),
    schedule: getWeeklyLabScheduleConfig_(),
    blueprint_sections: readWeeklyLabReportBlueprint_(),
    weekly_scores: readObjects_(SSMK.sheets.weeklyScores)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    market_data: readObjects_(SSMK.sheets.marketData)
      .filter((row) => sameDateText_(row.market_date, targetIssueDate)),
    news_events: readObjects_(SSMK.sheets.newsEvents)
      .filter((row) => sameDateText_(row.date, targetIssueDate)),
    hypothesis_reviews: readObjects_(SSMK.sheets.hypothesisReviews),
    hypothesis_lab: readObjects_(SSMK.sheets.hypothesisLab)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    hypothesis_evolution_log: readObjects_(SSMK.sheets.hypothesisEvolutionLog),
    visualization_queue: readObjects_(SSMK.sheets.visualizationQueue)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate) || String(row.report_id || '') === String(reportId || '')),
    revision_requests: readObjects_(SSMK.sheets.revisionRequests)
      .filter((row) => row.status === 'requested'),
    report_runs: readObjects_(SSMK.sheets.reportRuns),
    qa_review_log: readObjects_(SSMK.sheets.qaReviewLog),
  };
}
```

- [ ] **Step 3: Add small summary helpers**

Add:

```javascript
function topScoreRows_(rows, count) {
  return rows.slice()
    .sort((a, b) => estimateScoreFromRow_(b) - estimateScoreFromRow_(a))
    .slice(0, Math.max(1, Number(count || 5)));
}

function topNFromPreferences_(context) {
  const setting = (context.preferences || []).find((row) => String(row.setting_key) === 'core_hypothesis_count');
  const value = Number(setting && setting.setting_value);
  if (!Number.isNaN(value) && value > 0) return value;
  const topNSetting = (context.settings || []).find((row) => String(row.key) === 'top_n');
  const topN = Number(topNSetting && topNSetting.value);
  return Number.isNaN(topN) || topN <= 0 ? 5 : topN;
}

function sectionModel_(blueprint, docsMarkdown, emailHtmlSummary, sourceSummary, missingData, qualityFlags) {
  return {
    section_key: blueprint.section_key,
    section_title: blueprint.section_title,
    section_order: blueprint.section_order,
    required: blueprint.required,
    docs_output: blueprint.docs_output,
    email_output: blueprint.email_output,
    status: 'draft',
    docs_markdown: docsMarkdown || `${blueprint.section_title}\n\n${blueprint.beginner_purpose || '이번 주 학습 포인트를 정리합니다.'}`,
    email_html_summary: emailHtmlSummary || blueprint.beginner_purpose || '이번 주 학습 포인트를 정리합니다.',
    source_summary: sourceSummary || blueprint.data_sources || '',
    missing_data: missingData || '',
    quality_flags: qualityFlags || [],
  };
}
```

- [ ] **Step 4: Add section model builder**

Add:

```javascript
function buildWeeklyLabReportSectionModels_(context) {
  const topN = topNFromPreferences_(context);
  const topRows = topScoreRows_(context.weekly_scores || [], topN);
  const marketSummary = summarizeMarketChangesForLearning_(context.market_data || []);
  const scoreSummary = topRows.map((row, index) => `${index + 1}. ${row.ticker} ${row.company}: SSMK ${estimateScoreFromRow_(row).toFixed(2)}, 데이터 신뢰도 ${row.data_confidence || '중간'}`).join('\n');
  const hypothesisSummary = topRows.map((row, index) => [
    `### 가설 ${index + 1}. ${row.ticker} ${row.company}`,
    `- 실제 변화: ${marketChangeTextForTicker_(context, row.ticker)}`,
    `- 해석: ${row.reasoning_explanation || row.hypothesis_summary || '이번 주 데이터와 사업 질문의 연결을 확인합니다.'}`,
    `- 초보자 레슨: ${row.beginner_lesson || '점수보다 어떤 질문을 더 확인해야 하는지 보는 연습을 합니다.'}`,
    `- 다음 확인 질문: ${row.next_check || row.evidence_metrics || '다음 실적과 공식 자료를 확인합니다.'}`,
  ].join('\n')).join('\n\n');

  return (context.blueprint_sections || []).map((blueprint) => {
    if (blueprint.section_key === 'executive_dashboard') {
      return sectionModel_(blueprint, [
        `## ${blueprint.section_order}. ${blueprint.section_title}`,
        '',
        `- 기준일: ${context.issue_date}`,
        `- 이번 주 핵심 질문: 점수 상위 종목이 왜 공부 후보가 되었는지 실제 변화와 함께 확인합니다.`,
        `- 상위 관찰 대상:\n${scoreSummary || '- 아직 weekly_scores 데이터가 없습니다.'}`,
      ].join('\n'), `상위 관찰 대상은 ${topRows.map((row) => row.ticker).join(', ') || '아직 없음'}입니다. 점수는 결론이 아니라 질문을 고르는 도구입니다.`, 'weekly_scores; market_data', '', []);
    }
    if (blueprint.section_key === 'market_map') {
      return sectionModel_(blueprint, [
        `## ${blueprint.section_order}. ${blueprint.section_title}`,
        '',
        marketSummary,
        '',
        '읽는 포인트: 개별 기업을 보기 전에 시장이 성장주, 배당주, 에너지, 기술주 중 어디에 더 반응했는지 먼저 봅니다.',
      ].join('\n'), marketSummary, 'market_data', context.market_data.length === 0 ? 'market_data 없음' : '', context.market_data.length === 0 ? ['missing_market_data'] : []);
    }
    if (blueprint.section_key === 'hypothesis_lab') {
      return sectionModel_(blueprint, [
        `## ${blueprint.section_order}. ${blueprint.section_title}`,
        '',
        hypothesisSummary || '이번 주 핵심 가설을 만들 weekly_scores 데이터가 아직 없습니다.',
      ].join('\n'), topRows.map((row) => `${row.ticker}: ${row.next_check || row.evidence_metrics || '다음 확인 데이터 필요'}`).join(' / ') || '가설 데이터 준비 중', 'weekly_scores; hypothesis_lab; news_events', topRows.length === 0 ? 'weekly_scores 없음' : '', topRows.length === 0 ? ['missing_weekly_scores'] : []);
    }
    if (blueprint.section_key === 'forecast_vs_actual') {
      return sectionModel_(blueprint, [
        `## ${blueprint.section_order}. ${blueprint.section_title}`,
        '',
        forecastVsActualText_(context),
      ].join('\n'), forecastVsActualText_(context), 'hypothesis_reviews', (context.hypothesis_reviews || []).length === 0 ? 'hypothesis_reviews 없음' : '', []);
    }
    if (blueprint.section_key === 'dividend_etf_corner') {
      return sectionModel_(blueprint, [
        `## ${blueprint.section_order}. ${blueprint.section_title}`,
        '',
        dividendEtfCornerText_(context),
      ].join('\n'), dividendEtfCornerText_(context), 'shareholder_returns; etf_watch; weekly_scores', '', []);
    }
    return sectionModel_(blueprint, [
      `## ${blueprint.section_order}. ${blueprint.section_title}`,
      '',
      blueprint.beginner_purpose || '이번 주 학습 포인트를 정리합니다.',
      '',
      blueprint.notes || '데이터가 부족하면 부족한 이유를 함께 남깁니다.',
    ].join('\n'), blueprint.beginner_purpose || '이번 주 학습 포인트를 정리합니다.', blueprint.data_sources, '', []);
  });
}
```

- [ ] **Step 5: Add referenced text helpers**

Add:

```javascript
function summarizeMarketChangesForLearning_(marketRows) {
  if (!marketRows || marketRows.length === 0) {
    return '이번 자동 수집에서는 시장 가격 변화 데이터가 아직 충분하지 않습니다. 다음 실행에서 SPY, QQQ, SCHD, XLK, XLE 같은 ETF 흐름이 채워지는지 확인합니다.';
  }
  const summary = marketRows.slice(0, 8).map((row) => {
    const oneWeek = row.change_pct_1w !== '' ? `${roundTo2_(row.change_pct_1w)}%` : '확인 필요';
    const fourWeek = row.change_pct_4w !== '' ? `${roundTo2_(row.change_pct_4w)}%` : '확인 필요';
    return `${row.symbol}: 1주 ${oneWeek}, 4주 ${fourWeek}`;
  }).join(' / ');
  return `시장 지도 요약: ${summary}`;
}

function marketChangeTextForTicker_(context, ticker) {
  const symbol = String(ticker || '').trim().toUpperCase();
  const row = (context.market_data || []).find((item) => String(item.symbol || '').trim().toUpperCase() === symbol);
  if (!row) return '이번 자동 수집에서는 해당 종목의 가격 변화가 아직 확인되지 않았습니다.';
  const oneWeek = row.change_pct_1w !== '' ? `${roundTo2_(row.change_pct_1w)}%` : '확인 필요';
  const fourWeek = row.change_pct_4w !== '' ? `${roundTo2_(row.change_pct_4w)}%` : '확인 필요';
  return `1주 ${oneWeek}, 4주 ${fourWeek}`;
}

function forecastVsActualText_(context) {
  const reviews = (context.hypothesis_reviews || [])
    .filter((row) => row.review_status && row.review_status !== 'scheduled')
    .slice(-5);
  if (reviews.length === 0) {
    return '아직 복기 완료된 가설이 충분하지 않습니다. 이번 주에는 새 가설을 예약하고, 다음 1주/4주 실행에서 실제 결과와 비교합니다.';
  }
  return reviews.map((row) => `${row.hypothesis_id || '-'}: ${row.result_label || row.review_status || '복기 상태 확인'} / ${row.learning_note || '학습 메모 확인 필요'}`).join('\n');
}

function dividendEtfCornerText_(context) {
  const dividendRows = (context.weekly_scores || []).filter((row) => String(row.investment_style || '').indexOf('배당') !== -1 || String(row.dividend_focus || '').toLowerCase() === 'yes');
  const tickers = dividendRows.slice(0, 5).map((row) => row.ticker).filter(Boolean).join(', ');
  if (!tickers) {
    return '이번 자동 수집에서는 배당/ETF 전용 데이터가 아직 충분하지 않습니다. 배당률만 보고 판단하지 않고, 배당성향, 현금흐름, ETF 상위 보유 비중을 다음 확인 데이터로 남깁니다.';
  }
  return `이번 주 배당/ETF 관찰 후보는 ${tickers}입니다. 배당률이 높다는 사실만으로 결론을 내리지 않고, 배당을 유지할 현금흐름과 ETF 쏠림 위험을 함께 확인합니다.`;
}
```

- [ ] **Step 6: Run model hook test**

Run:

```bash
node tests/report-builder-quality-contract.test.js
```

Expected:

```text
Report context and section model assertions pass.
Remaining failures are quality gate, renderers, and old draft path integration.
```

- [ ] **Step 7: Commit context/model changes**

```bash
git add automation/Code.gs
git commit -m "feat: build weekly lab report section models"
```

---

## Task 6: Add Report Quality Gate

**Files:**

- Modify: `automation/Code.gs`
- Test: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Add quality gate constants and function**

Add:

```javascript
const WEEKLY_LAB_FORBIDDEN_REPORT_PATTERNS = [
  '를 통해 관찰 우선순위를 확인합니다.',
  '매수 추천',
  '매도 추천',
  '지금 사',
  '사야 할',
  '수익 보장',
];

const WEEKLY_LAB_EMAIL_OPERATION_PATTERNS = [
  'QA 상태',
  'blocked',
  'error_log',
  'bottleneck_log',
  '발행 전 체크리스트',
  '로그를 확인',
];

function runWeeklyLabReportQualityGate_(context, sectionModels, outputDrafts) {
  const models = sectionModels || [];
  const docsText = models.map((model) => model.docs_markdown || '').join('\n');
  const emailText = outputDrafts && outputDrafts.email_html ? outputDrafts.email_html : models.map((model) => model.email_html_summary || '').join('\n');
  const modelKeys = new Set(models.map((model) => model.section_key));
  const blockingIssues = [];
  const warnings = [];

  (context.blueprint_sections || [])
    .filter((section) => section.required && section.enabled !== false)
    .forEach((section) => {
      if (!modelKeys.has(section.section_key)) {
        blockingIssues.push(`필수 섹션 누락: ${section.section_key}`);
      }
    });

  WEEKLY_LAB_FORBIDDEN_REPORT_PATTERNS.forEach((pattern) => {
    if (docsText.indexOf(pattern) !== -1) {
      blockingIssues.push(`금지 문장 패턴 포함: ${pattern}`);
    }
  });

  WEEKLY_LAB_EMAIL_OPERATION_PATTERNS.forEach((pattern) => {
    if (emailText.indexOf(pattern) !== -1) {
      blockingIssues.push(`이메일 HTML 운영 문구 포함: ${pattern}`);
    }
  });

  models.forEach((model) => {
    if (model.required && String(model.docs_markdown || '').trim().length < 40) {
      warnings.push(`필수 섹션 본문이 짧음: ${model.section_key}`);
    }
    if (model.missing_data) {
      warnings.push(`데이터 보강 필요: ${model.section_key} - ${model.missing_data}`);
    }
  });

  return {
    status: blockingIssues.length > 0 ? 'blocked' : (warnings.length > 0 ? 'warning' : 'pass'),
    blocking_count: blockingIssues.length,
    warning_count: warnings.length,
    blocking_issues: blockingIssues,
    warnings: warnings,
    summary: blockingIssues.concat(warnings).join(' / '),
  };
}
```

- [ ] **Step 2: Add QA result recorder**

Add:

```javascript
function recordWeeklyLabQualityGateReview_(context, reportId, qualityResult) {
  appendObject_(SSMK.sheets.agentReviewLog, SSMK.headers.agentReviewLog, {
    review_id: `AR-${compactDate_(context.issue_date)}-${String(new Date().getTime()).slice(-6)}-QG`,
    issue_date: context.issue_date,
    agent_name: 'QA Gate',
    agent_role: '구조/문장/출력 분리 검증',
    review_target: `report-${reportId}`,
    status: qualityResult.status === 'blocked' ? 'block' : (qualityResult.status === 'warning' ? 'warning' : 'pass'),
    finding_summary: qualityResult.summary || '필수 구조와 출력 분리 검사 통과',
    risk_level: qualityResult.status === 'blocked' ? 'high' : (qualityResult.status === 'warning' ? 'medium' : 'low'),
    required_action: qualityResult.status === 'blocked' ? '차단 항목 수정 후 재생성' : '사용자 검토',
    blocking: qualityResult.status === 'blocked' ? 'TRUE' : 'FALSE',
    resolved: 'FALSE',
    resolved_at: '',
    notes: '자동 리포트 빌더 품질 게이트',
    run_id: context.run_id,
    report_id: reportId,
  });
}
```

- [ ] **Step 3: Run quality gate test**

Run:

```bash
node tests/report-builder-quality-contract.test.js
```

Expected:

```text
Quality gate assertions pass.
Remaining failures are renderers and integration with draft/email generation.
```

- [ ] **Step 4: Commit quality gate**

```bash
git add automation/Code.gs
git commit -m "feat: add weekly lab report quality gate"
```

---

## Task 7: Replace Docs Draft Rendering and Report Section Recording

**Files:**

- Modify: `automation/Code.gs`
- Test: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Add Docs renderer**

Add:

```javascript
function renderWeeklyLabDocsDraft_(context, sectionModels, qualityResult) {
  const sectionText = sectionModels
    .filter((model) => model.docs_output)
    .sort((a, b) => a.section_order - b.section_order)
    .map((model) => model.docs_markdown)
    .join('\n\n---\n\n');
  const qualityText = [
    '## 편집자용 QA 메모',
    '',
    `- QA Gate 상태: ${qualityResult.status}`,
    `- 차단 항목: ${qualityResult.blocking_issues.length ? qualityResult.blocking_issues.join(' / ') : '없음'}`,
    `- 경고 항목: ${qualityResult.warnings.length ? qualityResult.warnings.join(' / ') : '없음'}`,
    '',
    '## 발행 전 체크리스트',
    '',
    '- [ ] 추천/매수/매도처럼 읽히는 표현이 없는지 확인',
    '- [ ] 데이터가 부족한 항목이 사실처럼 쓰이지 않았는지 확인',
    '- [ ] 이메일 HTML에는 운영 로그와 QA 문구가 빠져 있는지 확인',
  ].join('\n');

  return [
    `SSMK Weekly Lab 초안 보고서 - ${context.issue_date}`,
    '',
    `run_id: ${context.run_id}`,
    `generated_at: ${context.generated_at}`,
    '',
    SSMK.disclaimer,
    '',
    sectionText,
    '',
    qualityText,
    '',
    '이 문서는 편집자용 초안입니다. 이메일은 자동 발송하지 않았습니다.',
  ].join('\n');
}
```

- [ ] **Step 2: Replace createWeeklyLabDraftReportDoc_ internals**

Replace `createWeeklyLabDraftReportDoc_(issueDate, runId)` with this structure:

```javascript
function createWeeklyLabDraftReportDoc_(issueDate, runId) {
  const targetIssueDate = issueDate || today_();
  const initialContext = collectWeeklyLabReportContext_(targetIssueDate, '', runId);
  if (initialContext.weekly_scores.length === 0) {
    throw new Error(`${targetIssueDate} 기준 weekly_scores가 없어 보고서 초안을 만들 수 없습니다.`);
  }

  const sectionModels = buildWeeklyLabReportSectionModels_(initialContext);
  const preQualityResult = runWeeklyLabReportQualityGate_(initialContext, sectionModels, {});
  const reportText = renderWeeklyLabDocsDraft_(initialContext, sectionModels, preQualityResult);
  const doc = DocumentApp.create(`SSMK Weekly Lab 초안 보고서 - ${targetIssueDate}`);
  doc.getBody().setText(reportText);
  doc.saveAndClose();

  const reportStatus = preQualityResult.status === 'blocked' ? '사용자 확인 필요' : '초안 생성';
  const reportId = createReportRunRow_(targetIssueDate, addDaysText_(targetIssueDate, -6), targetIssueDate, reportStatus, doc.getUrl(), `Weekly Lab blueprint draft. QA=${preQualityResult.status}. 이메일 발송 없음.`);
  const context = Object.assign({}, initialContext, { report_id: reportId });

  sectionModels.forEach((model) => {
    upsertReportSection_(
      reportId,
      model.section_key,
      model.section_title,
      model.status,
      model.email_html_summary || model.docs_markdown
    );
  });

  recordWeeklyLabQualityGateReview_(context, reportId, preQualityResult);
  createReportVersion_(reportId, 'v1', '', doc.getUrl(), 'Blueprint-based Weekly Lab draft report created');

  return {
    reportId: reportId,
    url: doc.getUrl(),
    qualityResult: preQualityResult,
  };
}
```

- [ ] **Step 3: Keep old builder as compatibility wrapper or remove hardcoded content**

If `buildWeeklyLabDraftReportText_()` remains, replace its body with:

```javascript
function buildWeeklyLabDraftReportText_(issueDate, runId, rows) {
  const context = collectWeeklyLabReportContext_(issueDate, '', runId);
  const fallbackContext = Object.assign({}, context, {
    weekly_scores: context.weekly_scores.length > 0 ? context.weekly_scores : (rows || []),
  });
  const sectionModels = buildWeeklyLabReportSectionModels_(fallbackContext);
  const qualityResult = runWeeklyLabReportQualityGate_(fallbackContext, sectionModels, {});
  return renderWeeklyLabDocsDraft_(fallbackContext, sectionModels, qualityResult);
}
```

- [ ] **Step 4: Update full cycle final status**

In `runWeeklyLabFullCycle`, after `runAgentReviewBoard`, combine blocking counts:

```javascript
    const qualityBlockingCount = reportResult.qualityResult ? reportResult.qualityResult.blocking_count : 0;
    const blockingCount = checks.filter((check) => check.blocking).length + qualityBlockingCount;
```

Keep final status as warning when data collection has warnings, and blocked/user-review status when quality gate blocks.

- [ ] **Step 5: Run draft path tests**

Run:

```bash
node tests/report-builder-quality-contract.test.js
node tests/weekly-full-cycle-contract.test.js
```

Expected:

```text
Draft rendering path assertions pass.
Remaining failures are email HTML output split and documentation checks.
```

- [ ] **Step 6: Commit draft renderer**

```bash
git add automation/Code.gs
git commit -m "feat: render weekly lab docs from blueprint sections"
```

---

## Task 8: Split Learner Email HTML from Operational QA Text

**Files:**

- Modify: `automation/Code.gs`
- Test: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Add email renderer**

Add:

```javascript
function renderWeeklyLabEmailHtml_(context, sectionModels) {
  const sectionHtml = sectionModels
    .filter((model) => model.email_output)
    .sort((a, b) => a.section_order - b.section_order)
    .map((model) => [
      '<section style="border-top:1px solid #d9dee6;padding:18px 0;">',
      `<h2 style="font-size:18px;margin:0 0 8px;color:#1f2937;">${escapeHtml_(model.section_title)}</h2>`,
      `<p style="font-size:15px;line-height:1.65;margin:0;color:#263241;">${escapeHtml_(model.email_html_summary || model.docs_markdown || '이번 주 학습 내용을 정리 중입니다.')}</p>`,
      '</section>',
    ].join('')).join('');

  return [
    '<!doctype html>',
    '<html>',
    '<body style="margin:0;background:#f7f8fa;font-family:Arial,sans-serif;color:#1f2937;">',
    '<div style="max-width:720px;margin:0 auto;padding:28px 18px;">',
    '<div style="background:#ffffff;border:1px solid #d9dee6;border-radius:8px;padding:24px;">',
    '<p style="margin:0 0 8px;font-size:12px;color:#5f6b7a;">SSMK Weekly Lab</p>',
    `<h1 style="margin:0 0 12px;font-size:26px;line-height:1.25;color:#1f2937;">${escapeHtml_(context.issue_date || today_())} 투자 관찰노트</h1>`,
    `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#5f6b7a;">${escapeHtml_(SSMK.disclaimer)}</p>`,
    sectionHtml,
    '<p style="margin:18px 0 0;font-size:12px;color:#5f6b7a;">이 메일은 투자 권유가 아니라 학습용 관찰 기록입니다. 최종 판단은 별도 확인이 필요합니다.</p>',
    '</div>',
    '</div>',
    '</body>',
    '</html>',
  ].join('');
}
```

- [ ] **Step 2: Update buildEmailFinalReportHtml_**

Replace `buildEmailFinalReportHtml_(report, sectionRows, qaRows)` with a wrapper that builds models from `report_sections` without using QA text:

```javascript
function buildEmailFinalReportHtml_(report, sectionRows, qaRows) {
  const context = collectWeeklyLabReportContext_(report.issue_date || today_(), report.report_id || '', '');
  const blueprintByKey = new Map((context.blueprint_sections || []).map((section) => [section.section_key, section]));
  const models = (sectionRows || []).map((section, index) => {
    const blueprint = blueprintByKey.get(String(section.section_key || '').trim()) || {
      section_key: section.section_key || `section_${index + 1}`,
      section_order: index + 1,
      section_title: section.section_title || section.section_key || '섹션',
      required: false,
      docs_output: true,
      email_output: true,
      data_sources: '',
    };
    return sectionModel_(
      blueprint,
      section.content_summary || '',
      section.content_summary || '',
      blueprint.data_sources || '',
      '',
      []
    );
  }).filter((model) => model.email_output);

  if (models.length === 0) {
    models.push(sectionModel_({
      section_key: 'summary',
      section_order: 1,
      section_title: '이번 주 학습 요약',
      required: false,
      docs_output: true,
      email_output: true,
      data_sources: '',
      beginner_purpose: '자세한 내용은 Google Docs 초안에서 검토합니다.',
    }, '자세한 내용은 Google Docs 초안에서 검토합니다.', '자세한 내용은 Google Docs 초안에서 검토합니다.', '', '', []));
  }

  return renderWeeklyLabEmailHtml_(context, models);
}
```

The `qaRows` parameter stays for API compatibility but is no longer used in learner-facing HTML.

- [ ] **Step 3: Run email output split test**

Run:

```bash
node tests/report-builder-quality-contract.test.js
```

Expected:

```text
Email output split assertions pass.
```

- [ ] **Step 4: Commit email split**

```bash
git add automation/Code.gs
git commit -m "fix: keep operations text out of weekly lab email"
```

---

## Task 9: Update Docs and Runbook

**Files:**

- Modify: `docs/operations/weekly-lab-runbook.md`
- Modify: `automation/google-apps-script-plan.md`
- Modify: `automation/ai-report-generation-workflow.md`

- [ ] **Step 1: Update runbook with blueprint concept**

In `docs/operations/weekly-lab-runbook.md`, add a new section after section 4:

```markdown
## 5. 리포트 목차와 기준을 바꾸는 곳

Weekly Lab 리포트의 실행용 목차는 Google Sheets의 `report_blueprint` 탭에서 관리한다.

초보자용으로 말하면:

```text
templates/weekly-report-template.md = 사람이 읽는 설계도
report_blueprint = Apps Script가 실제 실행 때 읽는 목차표
```

`report_blueprint`에서 바꿀 수 있는 것:

- 섹션 제목
- 섹션 순서
- Docs 초안 포함 여부
- 이메일 HTML 포함 여부
- 필수 섹션 여부
- 섹션별 품질 기준 메모

단, `section_key`는 코드와 QA가 식별하는 고정 이름이므로 함부로 바꾸지 않는다.
```

Renumber the following sections if needed.

- [ ] **Step 2: Update runbook schedule language**

In the schedule section, add:

```markdown
실행 요일과 시간은 코드에 고정된 값이 아니라 `user_preferences`와 `automation_schedules` 설정을 따른다.

예를 들어 현재 값이 화요일 08:00이라면 "매주 화요일 08:00"으로 표시되지만, 나중에 수요일 09:00으로 바꿀 수 있다.
```

- [ ] **Step 3: Update implementation docs**

In `automation/google-apps-script-plan.md`, add a short note near the report generation section:

```markdown
2026-05-06 개선 기준: 전체 사이클은 5개 섹션 하드코딩 초안을 만들지 않고, `report_blueprint` → report context → section models → QA Gate → Docs/HTML render 순서로 동작해야 한다.
```

In `automation/ai-report-generation-workflow.md`, add the same flow:

```markdown
최신 Weekly Lab 생성 흐름:

```text
collectWeeklyLabReportContext_()
→ buildWeeklyLabReportSectionModels_()
→ runWeeklyLabReportQualityGate_()
→ renderWeeklyLabDocsDraft_()
→ renderWeeklyLabEmailHtml_()
```
```

- [ ] **Step 4: Commit docs**

```bash
git add docs/operations/weekly-lab-runbook.md automation/google-apps-script-plan.md automation/ai-report-generation-workflow.md
git commit -m "docs: document weekly lab report builder flow"
```

---

## Task 10: Final Local Verification

**Files:**

- Verify: `automation/Code.gs`
- Verify: `tests/weekly-full-cycle-contract.test.js`
- Verify: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Run all local contract tests**

Run:

```bash
node tests/watchlist-normalization.test.js
node tests/watchlist-classification-guide.test.js
node tests/control-center-automation-dashboard.test.js
node tests/weekly-full-cycle-contract.test.js
node tests/report-builder-quality-contract.test.js
node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"
```

Expected:

```text
watchlist normalization ok
watchlist classification guide ok
control center automation dashboard contract ok
weekly full cycle contract ok
report builder quality contract ok
Code.gs syntax ok
```

- [ ] **Step 2: Inspect git diff**

Run:

```bash
git status --short
git diff --stat
```

Expected:

```text
Only planned files are modified.
No unrelated generated files are staged.
```

- [ ] **Step 3: Commit any final verification-only adjustments**

If a small test or doc correction is needed, commit it:

```bash
git add automation/Code.gs tests docs/operations/weekly-lab-runbook.md automation/google-apps-script-plan.md automation/ai-report-generation-workflow.md
git commit -m "test: verify weekly lab report builder contract"
```

Skip this commit if there are no changes after Task 9.

---

## Task 11: Live Verification Plan for Google Sheets and Apps Script

**Files:**

- No code changes in this task.
- Use after local tests pass and the user approves a live run.

- [ ] **Step 1: Confirm live verification scope**

Tell the user:

```text
로컬 테스트는 통과했습니다. 이제 실제 Google Sheets/Apps Script에 반영한 뒤 1회만 라이브 검증하겠습니다.
이 검증은 이메일을 보내지 않고, 새 Docs 초안과 HTML 검토본만 만듭니다.
```

- [ ] **Step 2: Apply Apps Script files manually or through the current deployment path**

The live Apps Script editor must contain:

```text
automation/Code.gs
automation/SettingsSidebar.html
```

- [ ] **Step 3: Run schema setup once**

In Apps Script, run:

```text
showSsmkSetupBuild()
setupSsmkWorkbook()
```

Expected:

```text
report_blueprint tab exists.
report_blueprint has the 12 default section rows.
```

- [ ] **Step 4: Run one report generation**

Use one of these after user approval:

```text
forceRestartWeeklyLabFullCycleForToday()
```

For revising the 2026-05-05 report, use the project’s available issue-date execution path if exposed. If no parameterized UI exists, run the revised builder for today and document that 2026-05-05 regeneration needs a tiny manual Apps Script wrapper.

- [ ] **Step 5: Verify live artifacts**

Check Google Sheets:

```text
report_sections includes all required section_key rows.
qa_review_log records warning or pass instead of silently passing structure failures.
agent_review_log has a QA Gate review row.
report_runs status is 초안 생성 or 사용자 확인 필요.
```

Check Google Docs:

```text
Docs draft includes Dividend & ETF Corner.
Docs draft includes Forecast vs Actual.
Docs draft includes editor QA memo.
```

Check HTML:

```text
HTML does not include QA 상태.
HTML does not include blocked.
HTML does not include error_log.
HTML does not include bottleneck_log.
HTML does not include 발행 전 체크리스트.
```

- [ ] **Step 6: Report live verification result**

Summarize:

```text
run_id
issue_date
report_id
Docs URL
HTML URL
QA Gate status
remaining warning/blocking items
email not sent confirmation
```

Do not send email.

---

## Self-Review Checklist

- [ ] Spec coverage: implements blueprint, schedule neutrality, shared context, section models, QA Gate, Docs/HTML split, tests, docs, and live verification plan.
- [ ] Placeholder scan: no unfinished markers or unspecified implementation steps are left.
- [ ] Type consistency: function names use `WeeklyLabReport` consistently for the new builder path.
- [ ] Safety: existing logs and old Drive/Docs artifacts are preserved.
- [ ] Scope: paid APIs, email sending, SEC/ETF data integrations, and dashboard redesign remain out of scope.

---

## Execution Options

Plan complete. Two execution options:

1. **Subagent-Driven (recommended)** - dispatch a fresh worker per task group, review between tasks, faster but needs careful integration.
2. **Inline Execution** - execute tasks in this session, slower but easier to keep the Apps Script changes coherent in one large file.

Recommended for this repo: **Inline Execution** for Tasks 1-10 because `automation/Code.gs` is a single large Apps Script file and the change boundaries are tightly coupled. Use live verification only after local tests pass and the user approves the actual Google Sheets/Apps Script run.
