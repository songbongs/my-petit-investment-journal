# Weekly Lab Quality Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make SSMK Weekly Lab generate learner-facing HTML from grounded content blocks, block weak reports through publish QC, and preserve the existing collection/scoring/logging/approval foundations.

**Architecture:** Add a quality layer above the current full-cycle automation: `report_fact_cards` for grounded facts, internal `ContentBlock` objects for learner content, a content-block HTML renderer, and a Sage publish QC gate before approval/send. Existing data collection, score calculation, schedule lookup, logging, revision request, and send functions remain structurally intact.

**Tech Stack:** Google Apps Script in `automation/Code.gs`, Node.js contract tests in `tests/*.js`, Google Sheets tabs managed by `setupSsmkWorkbook()`, clasp for Apps Script deployment.

**Execution Status (2026-05-07):** Implemented locally and pushed to the bound Apps Script project through build `2026-05-07-quality-architecture-v3`. Local contracts passed for report HTML quality, fact-card schema/builders, publish QC, full-cycle wiring, report-builder structure, watchlist normalization/classification, Control Center, and `Code.gs` syntax. The user ran `showSsmkSetupBuild()` and `setupSsmkWorkbook()`. `forceRestartWeeklyLabFullCycleForToday()` reached Apps Script timeout after the agent-review stage, so `continueWeeklyLabFullCycleForToday()` was added to finish only the email HTML final draft and Publish QC after a timeout. The user ran the continue function successfully. PDF review of the resulting HTML showed clear structural improvement but insufficient "teacher-grade" insight depth. See `docs/2026-05-07-weekly-lab-quality-v3-handoff.md` before resuming the next quality push.

---

## File Map

**Create**
- `tests/weekly-report-html-quality-contract.test.js`  
  Tests final learner-facing HTML, Korean titles, content-block rendering, data preservation, and operational text exclusion.
- `tests/report-fact-cards-contract.test.js`  
  Tests `report_fact_cards` schema and fact card generation from existing `market_data`, `weekly_scores`, and `watchlist` inputs.
- `tests/publish-qc-contract.test.js`  
  Tests Sage publish QC hard blocks, score thresholds, and approval/send guard helpers.

**Modify**
- `automation/Code.gs`  
  Add `reportFactCards` sheet/header config, reader title support, fact-card helpers, content-block helpers, HTML renderer changes, publish QC helpers, and approval/send guard checks.
- `tests/report-builder-quality-contract.test.js`  
  Extend structure contract so future regressions cannot remove `visible_title_ko`, content-block helpers, publish QC helpers, or `report_fact_cards`.
- `tests/weekly-full-cycle-contract.test.js`  
  Extend full-cycle contract so publish QC is wired after HTML draft generation without changing existing collection/scoring flow.

**Do Not Modify Unless A Test Explicitly Requires It**
- `collectAndStoreWeeklyBackData_()`
- `collectAndStoreNewsEvents_()`
- `buildWeeklyScoresFromBackData_()`
- `scheduledWeeklyLabTrigger()`
- `getWeeklyLabScheduleConfig_()`
- `email_auto_send` defaults
- Watchlist taxonomy helpers

---

### Task 1: Add Failing HTML Quality Contract

**Files:**
- Create: `tests/weekly-report-html-quality-contract.test.js`
- Modify: none in production code

- [ ] **Step 1: Write the failing test**

Create `tests/weekly-report-html-quality-contract.test.js`:

```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');

function loadApi() {
  return new Function(`${code}
    return {
      renderWeeklyLabEmailHtml_,
      sectionModel_
    };
  `)();
}

const { renderWeeklyLabEmailHtml_, sectionModel_ } = loadApi();

const context = {
  issue_date: '2026-05-07',
  visualization_queue: [],
};

const marketModel = sectionModel_(
  {
    section_key: 'market_map',
    section_order: 1,
    section_title: 'Market Map',
    visible_title_ko: '시장 지도: QQQ와 SCHD가 말해주는 위험 선호',
    required: true,
    docs_output: true,
    email_output: true,
    data_sources: 'market_data',
    quality_rule: 'must_explain_market_direction_without_recommendation',
    beginner_purpose: '개별 종목 전에 시장 바람의 방향을 봅니다.',
  },
  [
    '## Market Map',
    '### 실제 변화',
    '- QQQ 1주 변화 +1.5%, SCHD 1주 변화 -0.4%',
    '### 해석',
    '- 이번 주는 배당주보다 성장주 쪽에 힘이 더 실린 흐름으로 볼 수 있습니다.',
    '### 초보자 레슨',
    '- QQQ와 SCHD를 비교하면 시장이 성장 기대와 안정적인 배당 중 어디를 더 좋아했는지 연습할 수 있습니다.',
    '### 다음 확인 질문',
    '- 다음 주에도 QQQ가 SCHD보다 강한지 확인합니다.',
  ].join('\n'),
  '한 줄 요약만 있으면 실패해야 합니다.',
  '',
  ''
);

marketModel.content_blocks = [{
  section_key: 'market_map',
  visible_title_ko: '시장 지도: QQQ와 SCHD가 말해주는 위험 선호',
  reader_question: '이번 주는 성장주와 배당주 중 어디에 힘이 실렸나?',
  source_fact_ids: ['FACT-20260507-QQQ-1W', 'FACT-20260507-SCHD-1W'],
  actual_change: 'QQQ 1주 변화는 +1.5%, SCHD 1주 변화는 -0.4%였습니다.',
  interpretation: '성장주 ETF가 배당 ETF보다 강했기 때문에 시장이 안정적인 배당보다 성장 기대를 더 좋아한 주간일 수 있습니다.',
  beginner_lesson: '초보자는 ETF끼리 비교하면 개별 종목 전에 시장의 큰 바람을 먼저 볼 수 있습니다.',
  counter_question: '단기 가격 변화만으로 시장 성향을 확정할 수는 없습니다.',
  next_check: '다음 주에도 QQQ가 SCHD보다 강한지, XLK도 같은 방향인지 확인합니다.',
  missing_data_note: '',
  data_confidence: 'medium',
}];

const html = renderWeeklyLabEmailHtml_(context, [marketModel]);

assert(html.includes('시장 지도: QQQ와 SCHD가 말해주는 위험 선호'), 'HTML should show Korean learner-facing title');
assert(!html.includes('<h2 style="font-size:18px;margin:0 0 8px;color:#1f2937;">Market Map</h2>'), 'HTML should not expose English internal title');
assert(html.includes('실제 변화'), 'HTML should render actual change label');
assert(html.includes('해석'), 'HTML should render interpretation label');
assert(html.includes('초보자 레슨'), 'HTML should render beginner lesson label');
assert(html.includes('다음 확인 질문'), 'HTML should render next check label');
assert(html.includes('QQQ 1주 변화는 +1.5%'), 'HTML should preserve source fact number');
assert(!html.includes('한 줄 요약만 있으면 실패해야 합니다.'), 'HTML should not prefer email_html_summary over content blocks');
assert(!html.includes('QA 상태'), 'HTML should not include operational QA text');
assert(!html.includes('blocked'), 'HTML should not include blocked operational text');

console.log('weekly report html quality contract ok');
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```powershell
node tests\weekly-report-html-quality-contract.test.js
```

Expected: FAIL because the current renderer uses `section_title` and `email_html_summary` before content blocks.

- [ ] **Step 3: Do not implement yet**

Stop after confirming the failure. Implementation happens in Task 3 and Task 4.

---

### Task 2: Add Fact Card Schema Contract

**Files:**
- Create: `tests/report-fact-cards-contract.test.js`
- Modify later: `automation/Code.gs`

- [ ] **Step 1: Write the failing test**

Create `tests/report-fact-cards-contract.test.js`:

```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');

function contains(source, text, label) {
  assert(source.includes(text), `${label} should include: ${text}`);
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
contains(code, 'report_fact_cards', 'setup should know report_fact_cards');

console.log('report fact cards contract ok');
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```powershell
node tests\report-fact-cards-contract.test.js
```

Expected: FAIL because `report_fact_cards` and fact-card helpers do not exist yet.

---

### Task 3: Add Reader Titles And Content Block Helpers

**Files:**
- Modify: `automation/Code.gs`
- Modify: `tests/report-builder-quality-contract.test.js`

- [ ] **Step 1: Extend the existing structure test**

Add these checks to `tests/report-builder-quality-contract.test.js`:

```javascript
contains(code, 'visible_title_ko', 'reader-facing Korean title support');
contains(code, 'function contentBlock_', 'content block helper');
contains(code, 'function contentBlocksFromSectionModel_', 'section model content block extraction');
contains(code, 'function renderContentBlockHtml_', 'content block HTML renderer');
contains(code, 'function sectionDisplayTitle_', 'reader-facing title helper');
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```powershell
node tests\report-builder-quality-contract.test.js
```

Expected: FAIL because content-block helpers and `visible_title_ko` do not exist.

- [ ] **Step 3: Implement reader title support**

In `automation/Code.gs`, update `SSMK.headers.reportBlueprint` by appending `visible_title_ko` to the end of the header list. Do not remove or reorder existing columns.

Add `visible_title_ko` to each default blueprint object. Use these initial values:

```javascript
const WEEKLY_LAB_READER_TITLES = {
  executive_dashboard: '이번 주 시장 한눈에: 어디에 힘이 실렸나',
  market_map: '시장 지도: QQQ와 SCHD가 말해주는 위험 선호',
  industry_theme_board: '산업과 테마: 본업과 시장 이야기를 나눠 보기',
  stock_dashboard: '종목 관찰: 점수보다 질문을 먼저 보기',
  lens_deep_dive: 'SSMK 렌즈: 대표 종목을 천천히 해부하기',
  hypothesis_lab: '이번 주 관찰 가설 5개',
  forecast_vs_actual: '지난 가설 복기: 맞혔는가보다 무엇을 배웠는가',
  dividend_etf_corner: '배당과 ETF: 높은 배당률은 항상 좋은 신호일까',
  hypothesis_evolution_log: '가설 진화 기록: 질문이 어떻게 좋아졌나',
  learning_notes: '이번 주 레슨: 다음에도 써먹을 질문',
  sources_limitations: '출처와 한계: 무엇을 알고 무엇을 아직 모르는가',
  agent_review_board: '운영 검토: 발행 전 확인할 일',
};
```

Add helper:

```javascript
function sectionDisplayTitle_(section) {
  const key = String(section && section.section_key || '').trim();
  return String(section && section.visible_title_ko || '').trim()
    || WEEKLY_LAB_READER_TITLES[key]
    || String(section && section.section_title || key || '이번 주 학습 섹션').trim();
}
```

- [ ] **Step 4: Implement content block helpers**

Add helpers near the report section model functions:

```javascript
function contentBlock_(section, options) {
  const data = options || {};
  return {
    section_key: section.section_key,
    visible_title_ko: data.visible_title_ko || sectionDisplayTitle_(section),
    reader_question: data.reader_question || section.beginner_purpose || '이번 섹션에서 무엇을 배울 수 있는가?',
    source_fact_ids: data.source_fact_ids || [],
    actual_change: data.actual_change || '',
    interpretation: data.interpretation || '',
    beginner_lesson: data.beginner_lesson || '',
    counter_question: data.counter_question || '',
    next_check: data.next_check || '',
    missing_data_note: data.missing_data_note || '',
    data_confidence: data.data_confidence || 'medium',
  };
}

function contentBlocksFromSectionModel_(model) {
  if (model && Array.isArray(model.content_blocks) && model.content_blocks.length > 0) {
    return model.content_blocks;
  }
  return [];
}
```

Update `sectionModel_()` so the returned object includes:

```javascript
visible_title_ko: blueprint.visible_title_ko || sectionDisplayTitle_(blueprint),
content_blocks: blueprint.content_blocks || [],
```

- [ ] **Step 5: Run tests to verify GREEN**

Run:

```powershell
node tests\report-builder-quality-contract.test.js
node tests\weekly-report-html-quality-contract.test.js
```

Expected: `report-builder-quality-contract` passes. `weekly-report-html-quality-contract` may still fail until Task 4.

---

### Task 4: Render HTML From Content Blocks

**Files:**
- Modify: `automation/Code.gs`
- Test: `tests/weekly-report-html-quality-contract.test.js`

- [ ] **Step 1: Implement `renderContentBlockHtml_()`**

Add:

```javascript
function renderContentBlockHtml_(block) {
  const parts = [
    `<p style="font-size:14px;line-height:1.65;margin:0 0 10px;color:#5f6b7a;">${escapeHtml_(block.reader_question || '')}</p>`,
    '<div style="display:grid;gap:10px;">',
    learnerHtmlBlock_('실제 변화', block.actual_change),
    learnerHtmlBlock_('해석', block.interpretation),
    learnerHtmlBlock_('초보자 레슨', block.beginner_lesson),
    block.counter_question ? learnerHtmlBlock_('반대 질문', block.counter_question) : '',
    learnerHtmlBlock_('다음 확인 질문', block.next_check),
    block.missing_data_note ? learnerHtmlBlock_('부족한 데이터', block.missing_data_note) : '',
    '</div>',
  ];
  return parts.filter(Boolean).join('');
}

function learnerHtmlBlock_(label, text) {
  return [
    '<div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px;background:#ffffff;">',
    `<p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#374151;">${escapeHtml_(label)}</p>`,
    `<p style="margin:0;font-size:14px;line-height:1.65;color:#263241;">${escapeHtml_(text || '이번 자동 수집에서는 아직 확인되지 않았습니다.')}</p>`,
    '</div>',
  ].join('');
}
```

- [ ] **Step 2: Update `renderWeeklyLabEmailHtml_()`**

Replace the section mapping body with logic that uses content blocks first:

```javascript
.map((model) => {
  const blocks = contentBlocksFromSectionModel_(model);
  const bodyHtml = blocks.length > 0
    ? blocks.map(renderContentBlockHtml_).join('')
    : learnerHtmlBlock_('학습 메모', model.docs_markdown || model.email_html_summary || '이번 주 학습 내용을 정리 중입니다.');
  return [
    '<section style="border-top:1px solid #d9dee6;padding:18px 0;">',
    `<h2 style="font-size:18px;margin:0 0 8px;color:#1f2937;">${escapeHtml_(model.visible_title_ko || sectionDisplayTitle_(model))}</h2>`,
    bodyHtml,
    '</section>',
  ].join('');
})
```

Do not add operational QA text to this renderer.

- [ ] **Step 3: Run the HTML quality test**

Run:

```powershell
node tests\weekly-report-html-quality-contract.test.js
```

Expected: PASS.

- [ ] **Step 4: Run existing report builder test**

Run:

```powershell
node tests\report-builder-quality-contract.test.js
```

Expected: PASS.

---

### Task 5: Create Fact Card Schema And Builders

**Files:**
- Modify: `automation/Code.gs`
- Test: `tests/report-fact-cards-contract.test.js`

- [ ] **Step 1: Implement sheet and header config**

In `SSMK.sheets`, add:

```javascript
reportFactCards: 'report_fact_cards',
```

In `SSMK.headers`, add:

```javascript
reportFactCards: [
  'fact_id',
  'issue_date',
  'report_id',
  'section_key',
  'ticker',
  'asset_type',
  'fact_type',
  'metric_name',
  'period',
  'value',
  'unit',
  'comparison_value',
  'comparison_label',
  'source_key',
  'source_url',
  'source_date',
  'data_confidence',
  'data_status',
  'missing_reason',
  'notes',
],
```

Add `reportFactCards` to the schema/setup group that creates normal sheets. Keep existing sheet keys unchanged.

- [ ] **Step 2: Implement pure fact helpers**

Add:

```javascript
function factCard_(issueDate, reportId, sectionKey, fields) {
  const data = fields || {};
  const ticker = String(data.ticker || '').trim().toUpperCase();
  const metric = String(data.metric_name || data.fact_type || 'fact').trim().replace(/\s+/g, '_');
  return {
    fact_id: data.fact_id || `FACT-${compactDate_(issueDate)}-${ticker || sectionKey}-${metric}-${data.period || 'NA'}`,
    issue_date: issueDate,
    report_id: reportId || '',
    section_key: sectionKey,
    ticker: ticker,
    asset_type: data.asset_type || '',
    fact_type: data.fact_type || '',
    metric_name: data.metric_name || '',
    period: data.period || '',
    value: data.value || '',
    unit: data.unit || '',
    comparison_value: data.comparison_value || '',
    comparison_label: data.comparison_label || '',
    source_key: data.source_key || '',
    source_url: data.source_url || '',
    source_date: data.source_date || issueDate,
    data_confidence: data.data_confidence || 'medium',
    data_status: data.data_status || 'present',
    missing_reason: data.missing_reason || '',
    notes: data.notes || '',
  };
}

function missingFactCard_(issueDate, reportId, sectionKey, metricName, reason) {
  return factCard_(issueDate, reportId, sectionKey, {
    fact_type: 'missing_data',
    metric_name: metricName,
    data_confidence: 'low',
    data_status: 'missing',
    missing_reason: reason || '이번 자동 수집에서 확인되지 않았습니다.',
  });
}
```

- [ ] **Step 3: Implement builders without touching collectors**

Add:

```javascript
function buildMarketFactCards_(context) {
  return (context.market_data || []).map((row) => factCard_(context.issue_date, context.report_id, 'market_map', {
    ticker: row.symbol,
    asset_type: 'ticker',
    fact_type: 'price_change',
    metric_name: '1주 가격 변화',
    period: '1w',
    value: formatPercentChange_(row.change_pct_1w) || '',
    unit: '%',
    source_key: row.source || 'market_data',
    data_confidence: row.data_confidence || 'medium',
    notes: '가격 변화는 학습 질문의 출발점이며 투자 판단이 아닙니다.',
  }));
}

function buildScoreFactCards_(context) {
  return (context.weekly_scores || []).map((row) => factCard_(context.issue_date, context.report_id, 'stock_dashboard', {
    ticker: row.ticker,
    asset_type: 'ticker',
    fact_type: 'weekly_score',
    metric_name: 'SSMK 관찰 점수',
    period: 'weekly',
    value: roundTo2_(estimateScoreFromRow_(row)),
    unit: 'score',
    comparison_value: row.score_change || '',
    comparison_label: 'score_change',
    source_key: 'weekly_scores',
    data_confidence: row.data_confidence || 'medium',
    notes: '점수는 투자 판단이 아니라 질문 선택 도구입니다.',
  }));
}

function buildReportFactCards_(context) {
  const cards = []
    .concat(buildMarketFactCards_(context))
    .concat(buildScoreFactCards_(context));
  if (!context.etf_watch || context.etf_watch.length === 0) {
    cards.push(missingFactCard_(context.issue_date, context.report_id, 'dividend_etf_corner', 'ETF 상세 데이터', 'etf_watch 데이터가 아직 없습니다.'));
  }
  return cards;
}
```

- [ ] **Step 4: Run fact card test**

Run:

```powershell
node tests\report-fact-cards-contract.test.js
```

Expected: PASS.

- [ ] **Step 5: Run setup-related contracts**

Run:

```powershell
node tests\weekly-full-cycle-contract.test.js
node tests\report-builder-quality-contract.test.js
```

Expected: PASS.

---

### Task 6: Build Section Content Blocks From Existing Data

**Files:**
- Modify: `automation/Code.gs`
- Test: `tests/weekly-report-html-quality-contract.test.js`

- [ ] **Step 1: Update section builders to attach content blocks**

For each learner-facing section builder, keep existing `docs` and `emailSummary` generation, but attach `content_blocks` after `sectionModel_()` is created.

Example for `buildMarketMapSection_()`:

```javascript
const model = sectionModel_(section, docs, `${comparison} 주요 ETF 가격 변화는 Docs 초안에서 함께 확인합니다.`, missing.join(', '), '');
model.content_blocks = [contentBlock_(section, {
  reader_question: '이번 주는 성장주와 배당주 중 어디에 힘이 실렸나?',
  source_fact_ids: etfTickers.map((ticker) => `FACT-${compactDate_(context.issue_date)}-${ticker}-1W`),
  actual_change: lines.join(' / '),
  interpretation: comparison,
  beginner_lesson: 'ETF는 개별 종목 전에 시장의 큰 바람을 보는 기초 도구입니다.',
  counter_question: 'ETF의 단기 가격 변화만으로 시장 성향을 확정할 수는 없습니다.',
  next_check: '다음 주에도 QQQ, SCHD, XLK 흐름이 같은 방향인지 확인합니다.',
  missing_data_note: missing.join(', '),
  data_confidence: missing.length ? 'low' : 'medium',
})];
return model;
```

Apply the same pattern to:

- `buildExecutiveDashboardSection_()`
- `buildIndustryThemeBoardSection_()`
- `buildStockDashboardSection_()`
- `buildLensDeepDiveSection_()`
- `buildHypothesisLabSection_()`
- `buildForecastVsActualSection_()`
- `buildDividendEtfCornerSection_()`
- `buildLearningNotesSection_()`
- `buildSourcesLimitationsSection_()`

- [ ] **Step 2: Preserve non-email operations sections**

Do not force `agent_review_board` or `hypothesis_evolution_log` into email. Respect existing `email_output`.

- [ ] **Step 3: Run HTML quality test**

Run:

```powershell
node tests\weekly-report-html-quality-contract.test.js
```

Expected: PASS.

---

### Task 7: Add Publish QC Contract

**Files:**
- Create: `tests/publish-qc-contract.test.js`
- Modify later: `automation/Code.gs`

- [ ] **Step 1: Write the failing test**

Create `tests/publish-qc-contract.test.js`:

```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');

function loadApi() {
  return new Function(`${code}
    return {
      runPublishQualityGate_,
      canSendReportWithPublishQc_
    };
  `)();
}

const { runPublishQualityGate_, canSendReportWithPublishQc_ } = loadApi();

const sourceSnapshot = {
  facts_by_id: {
    'FACT-20260507-MSFT-PRICE-1W': {
      fact_id: 'FACT-20260507-MSFT-PRICE-1W',
      ticker: 'MSFT',
      value: '+1.5%',
      data_status: 'present',
      data_confidence: 'medium',
    },
  },
};

const goodHtml = [
  '<h2>종목 관찰: 점수보다 질문을 먼저 보기</h2>',
  '<p>실제 변화</p><p>MSFT 1주 가격 변화는 +1.5%였습니다.</p>',
  '<p>해석</p><p>가격 변화와 점수 변화를 함께 봐야 합니다.</p>',
  '<p>초보자 레슨</p><p>좋은 회사와 좋은 가격은 서로 다른 질문입니다.</p>',
  '<p>다음 확인 질문</p><p>다음 실적에서 Azure 성장률을 확인합니다.</p>',
  '<h2>배당과 ETF: 높은 배당률은 항상 좋은 신호일까</h2>',
  '<p>실제 변화</p><p>SCHD 흐름을 QQQ와 비교합니다.</p>',
  '<h2>지난 가설 복기: 맞혔는가보다 무엇을 배웠는가</h2>',
  '<p>다음 확인 질문</p><p>1주 뒤 가격과 점수 변화를 복기합니다.</p>',
].join('');

const good = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: goodHtml,
  source_snapshot: sourceSnapshot,
});

assert.notStrictEqual(good.status, 'blocked', 'grounded learner HTML should not be blocked');
assert(good.final_qc_score >= 70, 'grounded learner HTML should score at least warning level');

const recommendationHtml = goodHtml + '<p>MSFT는 지금 사도 좋습니다.</p>';
const blockedRecommendation = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: recommendationHtml,
  source_snapshot: sourceSnapshot,
});
assert.strictEqual(blockedRecommendation.status, 'blocked', 'recommendation wording should hard block');
assert(blockedRecommendation.blocking_issues.join(' ').includes('추천'), 'blocked result should explain recommendation risk');

const missingSections = '<h2>종목 관찰: 점수보다 질문을 먼저 보기</h2><p>실제 변화</p>';
const blockedMissing = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: missingSections,
  source_snapshot: sourceSnapshot,
});
assert.strictEqual(blockedMissing.status, 'blocked', 'missing Dividend/ETF and Forecast sections should block');

assert.strictEqual(canSendReportWithPublishQc_({ generation_status: '승인' }, null).ok, false, 'missing QC should prevent send');
assert.strictEqual(canSendReportWithPublishQc_({ generation_status: '승인' }, { status: 'blocked' }).ok, false, 'blocked QC should prevent send');
assert.strictEqual(canSendReportWithPublishQc_({ generation_status: '승인' }, { status: 'pass' }).ok, true, 'pass QC and approval should allow send');

console.log('publish qc contract ok');
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```powershell
node tests\publish-qc-contract.test.js
```

Expected: FAIL because `runPublishQualityGate_()` and `canSendReportWithPublishQc_()` do not exist yet.

---

### Task 8: Implement Sage Publish QC Pure Gate

**Files:**
- Modify: `automation/Code.gs`
- Test: `tests/publish-qc-contract.test.js`

- [ ] **Step 1: Add publish QC constants**

Add:

```javascript
const PUBLISH_QC_REQUIRED_HTML_MARKERS = [
  '실제 변화',
  '해석',
  '초보자 레슨',
  '다음 확인 질문',
  '배당과 ETF',
  '지난 가설 복기',
];

const PUBLISH_QC_HARD_BLOCK_PATTERNS = [
  '매수',
  '매도',
  '추천',
  '지금 사',
  '사도 좋',
  '수익 보장',
  'QA 상태',
  'blocked',
  'error_log',
  'bottleneck_log',
  '발행 전 체크리스트',
  'Executive Dashboard',
  'Market Map',
  'Hypothesis Lab',
  'Dividend & ETF Corner',
  'Forecast vs Actual',
];
```

- [ ] **Step 2: Add pure QC scorer**

Add:

```javascript
function runPublishQualityGate_(input) {
  const html = String(input && input.html || '');
  const blockingIssues = [];
  const warnings = [];

  PUBLISH_QC_HARD_BLOCK_PATTERNS.forEach((pattern) => {
    if (html.indexOf(pattern) !== -1) {
      blockingIssues.push(`BLOCK_FORBIDDEN_PATTERN: ${pattern}`);
    }
  });

  PUBLISH_QC_REQUIRED_HTML_MARKERS.forEach((marker) => {
    if (html.indexOf(marker) === -1) {
      blockingIssues.push(`BLOCK_REQUIRED_MARKER_MISSING: ${marker}`);
    }
  });

  const scoreBreakdown = {
    source_alignment: html.indexOf('MSFT') !== -1 || html.indexOf('QQQ') !== -1 || html.indexOf('SCHD') !== -1 ? 24 : 15,
    required_structure: blockingIssues.some((issue) => issue.indexOf('REQUIRED_MARKER') !== -1) ? 5 : 15,
    learning_flow: ['실제 변화', '해석', '초보자 레슨', '다음 확인 질문'].every((marker) => html.indexOf(marker) !== -1) ? 20 : 8,
    recommendation_safety: blockingIssues.some((issue) => /매수|매도|추천|지금 사|수익 보장/.test(issue)) ? 0 : 20,
    data_limits: html.indexOf('확인되지 않았습니다') !== -1 || html.indexOf('부족한 데이터') !== -1 ? 10 : 7,
    html_separation: blockingIssues.some((issue) => /QA 상태|blocked|error_log|bottleneck_log|체크리스트/.test(issue)) ? 0 : 5,
  };
  const finalScore = Object.keys(scoreBreakdown).reduce((sum, key) => sum + scoreBreakdown[key], 0);
  const status = blockingIssues.length > 0 || finalScore < 70
    ? 'blocked'
    : finalScore >= 85
      ? 'pass'
      : 'warning';

  return {
    status: status,
    final_qc_score: finalScore,
    score_breakdown: scoreBreakdown,
    blocking_count: blockingIssues.length,
    warning_count: warnings.length,
    blocking_issues: blockingIssues,
    warnings: warnings,
    summary: blockingIssues.concat(warnings).join(' / '),
  };
}
```

- [ ] **Step 3: Add send guard helper**

Add:

```javascript
function canSendReportWithPublishQc_(report, latestQc) {
  if (!latestQc) {
    return { ok: false, reason: '최신 세이지 Publish QC 결과가 없습니다.' };
  }
  if (latestQc.status === 'blocked') {
    return { ok: false, reason: '세이지 Publish QC가 blocked입니다.' };
  }
  if (!report || String(report.generation_status || '') !== '승인') {
    return { ok: false, reason: '리포트가 승인 상태가 아닙니다.' };
  }
  return { ok: true, reason: '발송 가능' };
}
```

- [ ] **Step 4: Run publish QC test**

Run:

```powershell
node tests\publish-qc-contract.test.js
```

Expected: PASS.

---

### Task 9: Record Publish QC And Wire It After HTML Draft

**Files:**
- Modify: `automation/Code.gs`
- Modify: `tests/weekly-full-cycle-contract.test.js`

- [ ] **Step 1: Extend full-cycle contract**

Add checks:

```javascript
contains(code, 'function runPublishQualityGate_', 'Sage publish QC gate');
contains(code, 'function recordPublishQualityGateReview_', 'publish QC log writer');
contains(code, 'function getLatestPublishQualityGateReview_', 'latest publish QC lookup');
contains(code, 'runPublishQualityGate_', 'email HTML flow should call publish QC');
```

- [ ] **Step 2: Run test to verify RED**

Run:

```powershell
node tests\weekly-full-cycle-contract.test.js
```

Expected: FAIL until log writer and lookup helpers are added.

- [ ] **Step 3: Add log writer**

Add:

```javascript
function recordPublishQualityGateReview_(context, reportId, htmlVersionId, qualityResult) {
  const qaId = `QA-${compactDate_(today_())}-${compactTime_()}-${String(new Date().getTime()).slice(-3)}-SAGE`;
  appendObject_(SSMK.sheets.qaReviewLog, SSMK.headers.qaReviewLog, {
    qa_id: qaId,
    run_id: context.run_id || '',
    review_date: today_(),
    overall_status: qualityResult.status,
    content_quality_score: qualityResult.final_qc_score,
    data_quality_score: qualityResult.score_breakdown && qualityResult.score_breakdown.source_alignment || '',
    visualization_quality_score: '',
    process_efficiency_score: '',
    main_issues: qualityResult.summary || '세이지 Publish QC 통과',
    recommended_next_action: qualityResult.status === 'blocked' ? '차단 항목 수정 후 HTML 재생성' : '사용자 검토 후 승인 가능',
    automation_change_needed: qualityResult.status === 'blocked' ? 'TRUE' : 'FALSE',
  });
  updateReportRunStatus_(reportId, qualityResult.status === 'blocked' ? '사용자 확인 필요' : '초안 생성', `sage_qc_status=${qualityResult.status}; score=${qualityResult.final_qc_score}; qa_id=${qaId}; html_version=${htmlVersionId || ''}`);
  return qaId;
}
```

- [ ] **Step 4: Add latest QC lookup**

Add:

```javascript
function getLatestPublishQualityGateReview_(reportId) {
  const rows = readObjects_(SSMK.sheets.qaReviewLog)
    .filter((row) => String(row.main_issues || '').indexOf('세이지 Publish QC') !== -1 || String(row.recommended_next_action || '').indexOf('HTML') !== -1)
    .filter((row) => !reportId || String(row.report_id || row.run_id || '').indexOf(String(reportId)) !== -1);
  return latestRowByText_(rows, 'review_date');
}
```

In this implementation, add `report_id`, `html_version_id`, `source_snapshot_id`, `checked_by`, `blocked_count`, `warning_count`, and `qc_score_breakdown` to `qaReviewLog` at the end of the header list. Write `checked_by: '세이지'` for publish QC rows. Do not reorder existing columns.

- [ ] **Step 5: Wire QC after HTML draft generation**

In `createEmailFinalReportDraft(reportId)`, after `createReportVersion_(reportId, versionLabel, '', file.getUrl(), 'Email HTML final draft created. 이메일 발송 전 검토용 HTML 최종본입니다.');` and before `return`, call:

```javascript
const publishQuality = runPublishQualityGate_({
  report_id: reportId,
  html: html,
  source_snapshot: {},
});
recordPublishQualityGateReview_(collectWeeklyLabReportContext_(report.issue_date || today_(), reportId, ''), reportId, versionLabel, publishQuality);
```

Do not change how the file is created.

- [ ] **Step 6: Run tests**

Run:

```powershell
node tests\weekly-full-cycle-contract.test.js
node tests\publish-qc-contract.test.js
```

Expected: PASS.

---

### Task 10: Guard Approval And Send

**Files:**
- Modify: `automation/Code.gs`
- Test: `tests/publish-qc-contract.test.js`

- [ ] **Step 1: Add final defense inside `sendApprovedReport(reportId)`**

At the start of `sendApprovedReport(reportId)`, after loading `report`, add:

```javascript
const latestPublishQc = getLatestPublishQualityGateReview_(reportId);
const sendGate = canSendReportWithPublishQc_(report, latestPublishQc);
if (!sendGate.ok) {
  throw new Error(`세이지 Publish QC 때문에 발송할 수 없습니다: ${sendGate.reason}`);
}
```

Keep the existing `generation_status === '승인'` check. This new gate is an additional defense.

- [ ] **Step 2: Add static contract check**

Extend `tests/publish-qc-contract.test.js` with:

```javascript
assert(code.includes('세이지 Publish QC 때문에 발송할 수 없습니다'), 'sendApprovedReport should guard against missing or blocked publish QC');
```

- [ ] **Step 3: Run publish QC test**

Run:

```powershell
node tests\publish-qc-contract.test.js
```

Expected: PASS.

---

### Task 11: Full Regression Suite

**Files:**
- No code changes

- [ ] **Step 1: Run existing contracts**

Run:

```powershell
node tests\watchlist-normalization.test.js
node tests\watchlist-classification-guide.test.js
node tests\control-center-automation-dashboard.test.js
node tests\weekly-full-cycle-contract.test.js
node tests\report-builder-quality-contract.test.js
```

Expected: all PASS.

- [ ] **Step 2: Run new quality contracts**

Run:

```powershell
node tests\weekly-report-html-quality-contract.test.js
node tests\report-fact-cards-contract.test.js
node tests\publish-qc-contract.test.js
```

Expected: all PASS.

- [ ] **Step 3: Run syntax check**

Run:

```powershell
node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"
```

Expected:

```text
Code.gs syntax ok
```

---

### Task 12: Apps Script Deployment Verification

**Files:**
- No repository file edits

- [ ] **Step 1: Check clasp status**

Run:

```powershell
npx -y @google/clasp show-file-status
```

Expected: `automation/Code.gs` and any Apps Script files show local changes ready to push.

- [ ] **Step 2: Push to Apps Script**

Run:

```powershell
npx -y @google/clasp push --force
```

Expected: push succeeds.

- [ ] **Step 3: Ask user to run live verification**

Ask the user to run these Apps Script functions in order:

```text
showSsmkSetupBuild()
setupSsmkWorkbook()
forceRestartWeeklyLabFullCycleForToday()
createEmailFinalReportDraft(report_id)
```

Expected log shape:

```text
report blueprint ready
weekly_scores 기반 가설 행 생성
이메일용 HTML 최종본 생성
sage_qc_status=blocked|warning|pass
이메일 발송 없음
```

Do not ask the user to run `sendApprovedReport(report_id)` unless Sage QC is not blocked and the user explicitly approves sending.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-07-weekly-lab-quality-architecture.md`. Two execution options:

**1. Subagent-Driven (recommended)** - Dispatch a fresh subagent per task group, review between tasks, and keep `automation/Code.gs` ownership narrow:
- Worker 1: Tasks 1, 2, and test fixture work.
- Worker 2: Tasks 3, 4, and 6 content block/HTML work.
- Worker 3: Task 5 fact card work.
- Worker 4: Tasks 7, 8, 9, and 10 publish QC/send guard work.
- Main Codex: Task 11 regression, Task 12 Apps Script deployment, conflict resolution.

**2. Inline Execution** - Execute tasks in this session with checkpoints after Task 2, Task 6, Task 10, and Task 12.

Recommended choice: **Subagent-Driven**, because `automation/Code.gs` is large and the work has separable tests, renderer, fact-card, and QC responsibilities.
