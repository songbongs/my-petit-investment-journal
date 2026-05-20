const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');

function loadApi() {
  return new Function(`${code}
    return {
      renderWeeklyLabEmailHtml_,
      sectionModel_,
      buildWeeklyLabReportSectionModels_
    };
  `)();
}

const { renderWeeklyLabEmailHtml_, sectionModel_, buildWeeklyLabReportSectionModels_ } = loadApi();

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
assert(html.includes('#f6f3f1'), 'HTML should use the referenced Paper Canvas surface');
assert(html.includes('#cfdaf5'), 'HTML should use the referenced Atmosphere Wash accent');
assert(html.includes('data-ssmk="metric-chip"'), 'HTML should split dense metrics into visual chips');
assert(html.includes('data-ssmk="mini-bar"'), 'HTML should render percentage changes as a visual mini bar');
assert(html.includes('<meta name="viewport"'), 'HTML should include mobile/print-friendly document metadata');
assert(html.includes('@page'), 'HTML should include print CSS so PDF export prefers a readable portrait page');
assert(html.includes('data-ssmk="learning-ladder"'), 'HTML should include a visual learning ladder that connects facts to interpretation');
assert(html.includes('숫자'), 'learning ladder should teach readers to start from the number');
assert(html.includes('의미'), 'learning ladder should teach readers to translate the number into meaning');
assert(html.includes('레슨'), 'learning ladder should teach readers what to learn from the case');
assert(!html.includes('한 줄 요약만 있으면 실패해야 합니다.'), 'HTML should not prefer email_html_summary over content blocks');
assert(!html.includes('QA 상태'), 'HTML should not include operational QA text');
assert(!html.includes('blocked'), 'HTML should not include blocked operational text');

const missingEtfMarketModel = sectionModel_(
  {
    section_key: 'market_map',
    section_order: 1,
    section_title: 'Market Map',
    visible_title_ko: '시장 지도: 성장주와 배당주의 온도차',
    required: true,
    docs_output: true,
    email_output: true,
    data_sources: 'market_data',
    quality_rule: 'must_explain_market_direction_without_recommendation',
    beginner_purpose: '개별 종목 전에 시장 바람을 봅니다.',
  },
  [
    '## Market Map',
    '### 실제 변화',
    '- SPY: 가격 변화 데이터 미수집',
    '- QQQ: 가격 변화 데이터 미수집',
    '- SCHD: 가격 변화 데이터 미수집',
    '- XLK: 가격 변화 데이터 미수집',
    '- XLE: 가격 변화 데이터 미수집',
    '### 해석',
    '- 주요 ETF 데이터가 비어 있어 이번 주 시장 선호는 확정하지 않습니다.',
    '### 초보자 레슨',
    '- 시장 지도는 데이터가 없을 때 억지로 결론을 내리지 않는 연습입니다.',
    '### 다음 확인 질문',
    '- 다음 실행에서 ETF 가격 변화가 수집되는지 확인합니다.',
  ].join('\n'),
  '',
  '주요 ETF 가격 변화 일부',
  ''
);
const missingEtfHtml = renderWeeklyLabEmailHtml_(context, [missingEtfMarketModel]);
const missingEtfLearningLadderHtml = (missingEtfHtml.match(/data-ssmk="learning-ladder"[\s\S]*?<div style="display:grid;gap:14px;">/) || [''])[0];
assert(missingEtfHtml.includes('data-ssmk="market-temperature"'), 'missing ETF state should still keep the market temperature teaching area');
assert(missingEtfHtml.includes('ETF 가격 데이터가 아직 비어 있습니다'), 'missing ETF state should explain the empty temperature board');
assert(missingEtfHtml.includes('빈 차트를 결론처럼 읽지 않습니다'), 'missing ETF state should teach the reader how to handle missing data');
assert(
  (missingEtfHtml.match(/>미수집</g) || []).length <= 1,
  'missing ETF state should not show five repetitive empty ETF bars'
);
assert(
  !missingEtfLearningLadderHtml.includes('SPY: 가격 변화 데이터 미수집 QQQ: 가격 변화 데이터 미수집'),
  'missing ETF state should not repeat every missing ETF inside the learning ladder'
);

function blueprint(sectionKey, sectionOrder, sectionTitle, visibleTitleKo, beginnerPurpose) {
  return {
    section_key: sectionKey,
    section_order: sectionOrder,
    section_title: sectionTitle,
    visible_title_ko: visibleTitleKo,
    required: true,
    enabled: true,
    docs_output: true,
    email_output: sectionKey !== 'agent_review_board',
    data_sources: 'contract_test',
    quality_rule: 'must_explain_for_beginner',
    beginner_purpose: beginnerPurpose || '초보자가 이번 섹션의 질문을 이해합니다.',
  };
}

const fullContext = {
  issue_date: '2026-05-07',
  generated_at: '2026-05-07 09:00',
  report_id: 'RPT-CONTRACT',
  run_id: 'RUN-CONTRACT',
  top_n: 3,
  hypothesis_count: 2,
  blueprint_sections: [
    blueprint('executive_dashboard', 1, 'Executive Dashboard', '한눈에 보는 이번 주 관찰 질문', '이번 주 전체 흐름을 먼저 잡습니다.'),
    blueprint('market_map', 2, 'Market Map', '시장 지도: 성장주와 배당주의 온도차', '개별 종목 전에 시장 바람을 봅니다.'),
    blueprint('industry_theme_board', 3, 'Industry & Theme Board', '산업과 테마: 이야기와 본업을 나눠 보기', '테마와 실제 산업을 구분합니다.'),
    blueprint('stock_dashboard', 4, 'Stock Dashboard', '종목 관찰: 점수보다 질문을 먼저 보기', '점수를 투자 판단이 아니라 질문으로 바꿉니다.'),
    blueprint('lens_deep_dive', 5, 'SSMK Lens Deep Dive', 'SSMK 렌즈: 한 종목을 깊게 뜯어보기', '사업, 점수, 가격을 분리합니다.'),
    blueprint('hypothesis_lab', 6, 'Core Hypotheses', '핵심 가설: 맞히기보다 복기하기', '가설을 나중에 검증할 질문으로 남깁니다.'),
    blueprint('dividend_etf_corner', 7, 'Dividend & ETF Corner', '배당과 ETF: 숫자 하나로 판단하지 않기', '배당과 ETF 흐름을 원인별로 봅니다.'),
    blueprint('forecast_vs_actual', 8, 'Forecast vs Actual', '지난 가설 복기: 무엇을 배웠는가', '예측보다 복기를 통해 배웁니다.'),
    blueprint('hypothesis_evolution_log', 9, 'Hypothesis Evolution', '가설의 변화: 질문이 어떻게 나아졌는가', '가설이 바뀐 이유를 기록합니다.'),
    blueprint('learning_notes', 10, 'Learning Notes', '이번 주 레슨: 다음에도 써먹을 질문', '한 주의 학습 포인트를 남깁니다.'),
    blueprint('sources_limitations', 11, 'Sources & Limitations', '출처와 한계: 모르는 것을 모른다고 쓰기', '데이터 한계를 사실처럼 쓰지 않습니다.'),
    blueprint('agent_review_board', 12, 'Agent Review Board', '운영 검토 보드', '운영자는 품질 상태를 봅니다.'),
  ],
  watchlist: [
    { ticker: 'MSFT', company: 'Microsoft', core_industry: 'AI/클라우드', theme_tags: 'AI, 클라우드', investment_style: '성장주', dividend_focus: '' },
    { ticker: 'QCOM', company: 'Qualcomm', core_industry: '반도체', theme_tags: 'AI, 자동차 반도체', investment_style: '성장주', dividend_focus: '' },
    { ticker: 'SCHD', company: 'SCHD ETF', core_industry: 'ETF', theme_tags: 'dividend', investment_style: '배당 ETF', dividend_focus: 'yes' },
  ],
  weekly_scores: [
    {
      issue_date: '2026-05-07',
      ticker: 'QCOM',
      company: 'Qualcomm',
      core_industry: '반도체',
      theme_tags: 'AI, 자동차 반도체',
      investment_style: '성장주',
      observation_grade: '높음',
      score_change: 0,
      total_score: 9.1,
      hypothesis_summary: 'QCOM의 급격한 가격 변화가 실제 사업 기대를 반영했는지 검증합니다.',
      evidence_metrics: '핸드셋 수요, 라이선스 매출, 자동차 수주잔고',
      reasoning_explanation: '가격 변화가 매우 크므로 먼저 데이터 신뢰도와 실제 이벤트를 나눠 봅니다.',
      beginner_lesson: '큰 상승률은 결론이 아니라 어떤 사업 숫자를 미리 반영했는지 묻는 출발점입니다.',
      limitations: '실적 서프라이즈, 주식분할, 데이터 오류 가능성은 추가 대조가 필요합니다.',
      next_check: '라이선스 매출, 자동차 수주잔고, 실적 발표 코멘트',
      data_confidence: 'medium',
    },
    {
      issue_date: '2026-05-07',
      ticker: 'MSFT',
      company: 'Microsoft',
      core_industry: 'AI/클라우드',
      theme_tags: 'AI, 클라우드',
      investment_style: '성장주',
      observation_grade: '높음',
      score_change: -0.3,
      total_score: 8.2,
      hypothesis_summary: 'AI 기대는 강하지만 가격 부담도 함께 확인해야 합니다.',
      evidence_metrics: '1주 가격 +1.5%, 점수 변화 -0.3',
      reasoning_explanation: '가격은 올랐지만 점수는 낮아져 기대와 부담을 함께 봐야 합니다.',
      beginner_lesson: '좋은 회사와 좋은 가격은 서로 다른 질문입니다.',
      limitations: '실적 세부 수치는 아직 자동 수집되지 않았습니다.',
      next_check: '다음 실적에서 Azure 성장률과 AI 투자비 설명을 확인합니다.',
      data_confidence: 'medium',
    },
    {
      issue_date: '2026-05-07',
      ticker: 'SCHD',
      company: 'SCHD ETF',
      core_industry: 'ETF',
      theme_tags: 'dividend',
      investment_style: '배당 ETF',
      observation_grade: '중간',
      score_change: 0.1,
      total_score: 6.4,
      hypothesis_summary: '배당 ETF 흐름은 성장주와 비교해 방어 성향을 확인하는 기준입니다.',
      evidence_metrics: '1주 가격 -0.4%',
      reasoning_explanation: 'QQQ보다 약하면 시장이 배당보다 성장 기대를 선호했을 수 있습니다.',
      beginner_lesson: '배당 ETF도 가격 변화와 배당 지속성을 나눠 봐야 합니다.',
      limitations: 'ETF 구성비와 배당수익률은 아직 자동 수집되지 않았습니다.',
      next_check: 'QQQ와 SCHD의 상대 흐름을 다음 주에도 비교합니다.',
      data_confidence: 'medium',
    },
  ],
  market_data: [
    { market_date: '2026-05-07', symbol: 'SPY', change_pct_1w: 0.6, change_pct_4w: 2.1, source_key: 'market_data' },
    { market_date: '2026-05-07', symbol: 'QQQ', change_pct_1w: 1.5, change_pct_4w: 4.0, source_key: 'market_data' },
    { market_date: '2026-05-07', symbol: 'SCHD', change_pct_1w: -0.4, change_pct_4w: 0.8, source_key: 'market_data' },
    { market_date: '2026-05-07', symbol: 'XLK', change_pct_1w: 1.2, change_pct_4w: 3.5, source_key: 'market_data' },
    { market_date: '2026-05-07', symbol: 'XLE', change_pct_1w: -1.1, change_pct_4w: -2.0, source_key: 'market_data' },
    { market_date: '2026-05-07', symbol: 'QCOM', change_pct_1w: 41.07, change_pct_4w: 91.45, source_key: 'market_data' },
    { market_date: '2026-05-07', symbol: 'MSFT', change_pct_1w: 1.5, change_pct_4w: 16.0, source_key: 'market_data' },
  ],
  market_by_symbol: {},
  news_events: [],
  sector_theme_scores: [],
  shareholder_returns: [],
  etf_watch: [],
  company_fundamentals: [],
  revenue_breakdown: [],
  insider_activity: [],
  hypothesis_lab: [],
  hypothesis_reviews: [
    {
      ticker: 'MSFT',
      review_window: '1w',
      result_label: '일부 확인',
      actual_outcome: '가격은 올랐지만 점수 변화는 약했습니다.',
    },
  ],
  hypothesis_evolution_log: [
    {
      hypothesis_id: 'HYP-20260507-001',
      hypothesis_version: 'v2',
      previous_hypothesis: 'AI 기대가 주가를 밀어 올립니다.',
      new_hypothesis: 'AI 기대와 투자비 부담을 함께 봅니다.',
      change_reason: '가격 변화와 점수 변화가 엇갈렸습니다.',
    },
  ],
  visualization_queue: [],
  agent_review_log: [],
  qa_review_log: [],
  source_policy: [],
  data_sources: [],
};

fullContext.market_data.forEach((row) => {
  fullContext.market_by_symbol[row.symbol] = row;
});

const sectionModels = buildWeeklyLabReportSectionModels_(fullContext);
const learnerModels = sectionModels.filter((model) => model.email_output);
assert.strictEqual(sectionModels.length, fullContext.blueprint_sections.length, 'contract context should exercise every blueprint section');
assert(learnerModels.length >= 10, 'contract context should exercise learner-facing section builders');
const missingContentBlockSections = learnerModels
  .filter((model) => !Array.isArray(model.content_blocks) || model.content_blocks.length === 0)
  .map((model) => model.section_key);

assert.deepStrictEqual(missingContentBlockSections, [], 'all learner-facing section builders should attach content_blocks');

learnerModels.forEach((model) => {
  const block = model.content_blocks[0];
  assert(block.visible_title_ko, `${model.section_key} content block should keep Korean title`);
  assert(block.actual_change, `${model.section_key} content block should explain actual change`);
  assert(block.interpretation, `${model.section_key} content block should explain interpretation`);
  assert(block.beginner_lesson, `${model.section_key} content block should explain beginner lesson`);
  assert(block.next_check, `${model.section_key} content block should explain next check`);
});

const fullHtml = renderWeeklyLabEmailHtml_(fullContext, sectionModels);
assert(fullHtml.includes('MSFT(Microsoft)'), 'HTML should format ticker and company as MSFT(Microsoft)');
assert(!fullHtml.includes('MSFT Microsoft'), 'HTML should not format ticker and company as bare adjacent words');
assert(fullHtml.includes('QCOM'), 'HTML should include the detailed QCOM hypothesis card');
assert(fullHtml.includes('데이터 신뢰도 확인'), 'HTML should show data reliability checks for extreme hypothesis moves');
assert(fullHtml.includes('반대 시나리오'), 'HTML should show counter-scenarios for hypothesis cards');
assert(fullHtml.includes('가설 수정 기준'), 'HTML should show hypothesis revision rules');
assert(fullHtml.includes('다음 검증 데이터'), 'HTML should show next validation data for hypothesis cards');
assert(fullHtml.includes('핸드셋 수요'), 'HTML should preserve concrete evidence metrics inside hypothesis cards');
assert(fullHtml.includes('data-ssmk="metric-chip"'), 'full learner HTML should include metric chips for dense facts');
assert(fullHtml.includes('data-ssmk="mini-bar"'), 'full learner HTML should include mini bar visuals for percent changes');
assert(fullHtml.includes('data-ssmk="market-temperature"'), 'market-oriented sections should include a beginner-friendly ETF temperature board');
assert(fullHtml.includes('성장 기대'), 'ETF temperature board should explain QQQ as growth expectation');
assert(fullHtml.includes('배당 안정성'), 'ETF temperature board should explain SCHD as dividend stability');
assert(fullHtml.includes('data-ssmk="hypothesis-map"'), 'hypothesis section should include a visual map of fact, counter-scenario, and next validation');
assert(fullHtml.includes('관찰된 숫자'), 'hypothesis visual map should label the observed number');
assert(fullHtml.includes('틀릴 수 있는 이유'), 'hypothesis visual map should label the counter-scenario');
assert(fullHtml.includes('다음에 볼 데이터'), 'hypothesis visual map should label the next validation data');
assert(!fullHtml.includes('해당 가설을 평가하면 안 됩니다'), 'learner HTML should not sound like an internal operating instruction');
assert(!fullHtml.includes('Hypothesis Lab'), 'learner HTML should not include internal English section names');
assert(!fullHtml.includes('Forecast vs Actual'), 'learner HTML should not include internal English section names');
[
  'weekly_scores',
  'market_data',
  'news_events',
  'source_policy',
  'data_sources',
  'company_fundamentals',
  'shareholder_returns',
  'etf_watch',
].forEach((internalName) => {
  assert(!fullHtml.includes(internalName), `learner HTML should not expose internal data source name ${internalName}`);
});
assert(fullHtml.includes('관찰 점수 데이터'), 'learner HTML should translate internal score source into reader-facing Korean');
assert(fullHtml.includes('가격 변화 데이터'), 'learner HTML should translate internal market source into reader-facing Korean');
assert(fullHtml.includes('AI/클라우드'), 'learner HTML should keep industry distribution details visible');
assert(fullHtml.includes('data-ssmk="metric-chip"'), 'dense section facts should be rendered into chip rows');
assert(!fullHtml.includes('SPY: SPY 가격 변화 미수집'), 'ETF missing-data rows should not repeat the ticker in a sentence-like way');

function countOccurrences(text, pattern) {
  return (String(text || '').match(new RegExp(pattern, 'g')) || []).length;
}

assert(
  countOccurrences(fullHtml, '초보자는 숫자 하나를 외우기보다') <= 3,
  'learner HTML should not pad many sections with the same generic beginner sentence'
);
assert(
  countOccurrences(fullHtml, '좋은 회사, 좋은 산업, 좋은 가격은 서로 다른 질문입니다') <= 1,
  'learner HTML should not duplicate the same lesson sentence inside one block'
);

function compactTextLength(value) {
  return String(value || '').replace(/\s+/g, '').length;
}

learnerModels.forEach((model) => {
  model.content_blocks.forEach((block, index) => {
    ['actual_change', 'interpretation', 'beginner_lesson', 'next_check'].forEach((field) => {
      assert(
        compactTextLength(block[field]) >= 70,
        `${model.section_key} content block ${index + 1} ${field} should be substantial enough for beginner learning`
      );
    });
  });
});

const storedHypothesisMarkdown = [
  '## Hypothesis Lab',
  '### 실제 변화',
  '- 가설 1 QCOM: 1주 +4.63%, 4주 +53.53%, 점수 7.15, 근거 지표 핸드셋 수요, 라이선스 매출, 자동차 수주잔고',
  '### 해석',
  '- 가설은 단순 질문이 아니라 데이터에서 출발한 임시 판단입니다.',
  '### 초보자 레슨',
  '- 초보자는 가설을 세울 때 관찰된 사실, 해석, 예상, 반대 시나리오, 가설 수정 기준을 한 묶음으로 남겨야 합니다.',
  '### 다음 확인 질문',
  '- 각 가설은 1주 뒤와 4주 뒤에 복기합니다.',
  '### 가설 1. QCOM Qualcomm',
  '- 관찰된 사실: 1주 +4.63%, 4주 +53.53%, SSMK 점수 7.15.',
  '- 데이터 신뢰도 확인: 1주 +4.63%, 4주 +53.53%처럼 변화폭이 매우 큽니다.',
  '- 해석: 4주 변화폭이 크므로 가격만 먼저 움직인 기대 선반영인지 확인합니다.',
  '- 한 줄 가설: 실제 이벤트가 확인되면 시장은 핸드셋 수요와 자동차 수주잔고 개선을 선반영했다고 볼 수 있습니다.',
  '- 근거 지표: 핸드셋 수요, 라이선스 매출, 자동차 수주잔고',
  '- 초보자 레슨: 큰 상승률은 결론이 아니라 어떤 사업 숫자를 미리 반영했는지 묻는 출발점입니다.',
  '- 반대 시나리오: 핵심 지표가 개선되지 않으면 이번 가설은 약해집니다.',
  '- 가설 수정 기준: 4주 뒤에도 핵심 지표 개선 근거가 없으면 근거 확인 부족 가설로 낮춥니다.',
  '- 다음 검증 데이터: 라이선스 매출, 자동차 수주잔고, 실적 발표 코멘트',
].join('\n');
const storedHypothesisModel = sectionModel_(
  blueprint('hypothesis_lab', 1, 'Hypothesis Lab', '이번 주 관찰 가설 5개', '가설을 복기 가능한 카드로 남깁니다.'),
  storedHypothesisMarkdown,
  storedHypothesisMarkdown,
  '',
  ''
);
const storedHypothesisHtml = renderWeeklyLabEmailHtml_(context, [storedHypothesisModel]);
assert(storedHypothesisHtml.includes('데이터 신뢰도 확인'), 'stored report_sections markdown should keep hypothesis reliability detail in HTML');
assert(storedHypothesisHtml.includes('한 줄 가설'), 'stored report_sections markdown should keep one-line hypothesis in HTML');
assert(storedHypothesisHtml.includes('다음 검증 데이터'), 'stored report_sections markdown should keep next validation data in HTML');

console.log('weekly report html quality contract ok');
