const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');

function loadApi() {
  return new Function(`${code}
    return {
      buildHypothesisLabSection_,
      buildLensDeepDiveSection_,
      buildLearningNotesSection_,
      buildForecastVsActualSection_,
      runWeeklyLabReportQualityGate_
    };
  `)();
}

const {
  buildHypothesisLabSection_,
  buildLensDeepDiveSection_,
  buildLearningNotesSection_,
  buildForecastVsActualSection_,
  runWeeklyLabReportQualityGate_,
} = loadApi();

const hypothesisSection = {
  section_key: 'hypothesis_lab',
  section_order: 6,
  section_title: 'Hypothesis Lab',
  visible_title_ko: '이번 주 관찰 가설 5개',
  required: true,
  enabled: true,
  docs_output: true,
  email_output: true,
  data_sources: 'weekly_scores; news_events',
  quality_rule: 'must_have_clear_causal_hypothesis',
  beginner_purpose: '이번 주 핵심 가설을 데이터에서 출발해 명확한 예측과 복기 기준으로 바꿉니다.',
};

const context = {
  issue_date: '2026-05-12',
  report_id: 'RPT-TEST',
  run_id: 'RUN-TEST',
  top_n: 5,
  hypothesis_count: 1,
  market_by_symbol: {
    QCOM: {
      symbol: 'QCOM',
      change_pct_1w: 41.07,
      change_pct_4w: 91.45,
      source: 'GOOGLEFINANCE',
      data_confidence: 'medium',
    },
  },
  weekly_scores: [],
  market_data: [],
  company_fundamentals: [],
  shareholder_returns: [],
};

const qcomRow = {
  ticker: 'QCOM',
  company: 'Qualcomm',
  score_total: 7.15,
  score_change: 0,
  evidence_metrics: '핸드셋 수요, 라이선스 매출, 자동차 수주잔고',
  hypothesis_summary: 'Qualcomm(QCOM)는 최근 가격 변화는 1주 +41.07%, 4주 +91.45%입니다. 이번 주에는 핸드셋 수요, 라이선스 매출, 자동차 수주잔고가 이 변화와 실제 사업 흐름을 함께 설명하는지 확인하는 학습 질문으로 남깁니다.',
  reasoning_explanation: '스마트폰 이후 자동차·온디바이스 AI로 사업 축이 넓어지는지 관찰. 이번 주 해석은 1주 가격 변화 +41.07%와 점수 변화 0를 함께 놓고, 가격 움직임이 기업/산업 질문으로 이어지는지 살피는 방식으로 시작합니다.',
  beginner_lesson: 'QCOM은 성장 기대가 큰 쪽이므로 좋은 이야기와 실제 매출/마진 확인을 분리해서 보는 연습이 필요합니다.',
  limitations: '현재 자동 수집은 가격/거래량 중심 1차 데이터입니다. 뉴스, 공시, 실적 세부값은 추가 확인이 필요합니다.',
  next_check: '실적발표, 스마트폰 출하량, 자동차 반도체 업데이트',
};

const model = buildHypothesisLabSection_(hypothesisSection, context, [qcomRow]);
const text = model.docs_markdown;

assert(!text.includes('확인하는 학습 질문으로 남깁니다'), 'hypothesis should not end as a vague learning question');
assert(!text.includes('살피는 방식으로 시작합니다'), 'hypothesis should not use vague observation-start language');
assert(!text.includes('- 반대 질문:'), 'hypothesis should label concrete counter-scenarios, not vague counter questions');
assert(text.includes('반대 시나리오'), 'hypothesis should include an explicit counter-scenario');
assert(text.includes('판단할 수 있습니다'), 'hypothesis should make a clear data-based interpretation');
assert(text.includes('예상'), 'hypothesis should state a concrete forward-looking hypothesis');
assert(text.includes('데이터 신뢰도 확인'), 'extreme price moves should trigger a data reliability check');
assert(text.includes('가설 수정 기준'), 'hypothesis should tell the reader when the initial hypothesis must change');

const lensModel = buildLensDeepDiveSection_(
  Object.assign({}, hypothesisSection, {
    section_key: 'lens_deep_dive',
    section_title: 'SSMK Lens Deep Dive',
  }),
  context,
  [qcomRow]
);
assert(!lensModel.docs_markdown.includes('확인하는 학습 질문으로 남깁니다'), 'lens deep dive should not reuse vague starter hypothesis text');
assert(lensModel.docs_markdown.includes('예상'), 'lens deep dive should include a clear expectation');

const learningModel = buildLearningNotesSection_(
  Object.assign({}, hypothesisSection, {
    section_key: 'learning_notes',
    section_title: 'Learning Notes',
  }),
  context,
  [qcomRow]
);
assert(!learningModel.docs_markdown.includes('보는 연습이 필요합니다'), 'learning notes should not reuse generic practice language');
assert(learningModel.docs_markdown.includes('가격 변화가 어떤 사업 지표 개선을 예상한 것인지'), 'learning notes should teach the concrete interpretation pattern');

const forecastSection = Object.assign({}, hypothesisSection, {
  section_key: 'forecast_vs_actual',
  section_title: 'Forecast vs Actual',
});
const forecastModel = buildForecastVsActualSection_(forecastSection, Object.assign({}, context, {
  hypothesis_reviews: [{
    ticker: 'QCOM',
    review_window: '1w',
    previous_hypothesis: '핸드셋 수요와 자동차 수주잔고가 개선되면 QCOM 상승 추세가 이어진다',
    expected_outcome: '1주 뒤 가격과 점수가 함께 상승',
    actual_outcome: '1주 뒤 가격은 하락했고 점수는 변하지 않음',
    result_label: '어긋남',
    outcome_data: '가격 -4.2%, 점수 변화 0',
    change_reason: '가격만 먼저 올랐고 사업 지표 개선 근거가 아직 부족함',
  }],
}));
assert(forecastModel.docs_markdown.includes('실제로는'), 'forecast review should explain what actually happened');
assert(forecastModel.docs_markdown.includes('가설 수정'), 'forecast review should state how the hypothesis changes');

const missingForecastModel = buildForecastVsActualSection_(forecastSection, Object.assign({}, context, {
  hypothesis_reviews: [{
    ticker: 'MSFT',
    review_window: '1w',
    result_label: '',
    actual_outcome: '',
    outcome_data: '',
  }, {
    ticker: 'GM',
    review_window: '1w',
    result_label: '',
    actual_outcome: '',
    outcome_data: '',
  }],
}));
assert(!missingForecastModel.docs_markdown.includes('아직 모름 / 실제 결과 미입력'), 'missing forecast review should not render vague unknown placeholders');
assert(missingForecastModel.docs_markdown.includes('복기 데이터 미입력'), 'missing forecast review should name the operational failure plainly');
assert(!missingForecastModel.docs_markdown.includes('해당 가설을 평가하면 안 됩니다'), 'missing forecast review should not read like an internal operating instruction');
assert(missingForecastModel.docs_markdown.includes('이번 주에는 결론을 내리지 않습니다'), 'missing forecast review should explain the learner-facing consequence of missing data');
assert.strictEqual(
  (missingForecastModel.docs_markdown.match(/이번 주에는 결론을 내리지 않습니다/g) || []).length,
  1,
  'missing forecast review should summarize repeated missing rows instead of repeating the same lesson per ticker'
);

const weakQuality = runWeeklyLabReportQualityGate_(
  { blueprint_sections: [hypothesisSection] },
  [{
    section_key: 'hypothesis_lab',
    required: true,
    docs_markdown: '이번 주에는 데이터가 실제 사업 흐름과 연결되는지 확인하는 학습 질문으로 남깁니다.',
    email_output: true,
    email_html_summary: '확인하는 학습 질문으로 남깁니다.',
  }],
  {}
);

assert.strictEqual(weakQuality.status, 'blocked', 'quality gate should block vague learning-question prose');
assert(
  weakQuality.blocking_issues.join(' ').includes('학습 질문'),
  'quality gate should explain vague learning-question prose as the issue'
);

console.log('weekly lab teaching insight contract ok');
