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
  '<h2>이번 주 관찰 가설 5개</h2>',
  '<p>실제 변화</p><p>QCOM 1주 가격 변화는 +41.07%, 4주 가격 변화는 +91.45%였습니다.</p>',
  '<p>데이터 신뢰도 확인</p><p>급등락이 크므로 실적 서프라이즈, 주식분할, GoogleFinance 계산 오류 가능성을 먼저 대조합니다.</p>',
  '<p>해석</p><p>데이터가 맞다면 시장은 핸드셋 수요와 자동차 수주잔고 개선 기대를 가격에 먼저 반영한 흐름으로 볼 수 있습니다.</p>',
  '<p>한 줄 가설</p><p>라이선스 매출과 자동차 수주잔고가 같이 좋아지면 성장 기대가 사업 숫자로 이어진다는 가설을 유지합니다.</p>',
  '<p>근거 지표</p><p>핸드셋 수요, 라이선스 매출, 자동차 수주잔고</p>',
  '<p>반대 시나리오</p><p>실적 지표가 개선되지 않으면 가격만 먼저 움직인 기대 선반영으로 가설을 낮춥니다.</p>',
  '<p>가설 수정 기준</p><p>4주 뒤에도 핵심 지표 개선 근거가 없으면 근거 확인 부족 가설로 낮춥니다.</p>',
  '<p>다음 검증 데이터</p><p>라이선스 매출, 자동차 수주잔고, 실적 발표 코멘트</p>',
  '<h2>배당과 ETF: 높은 배당률은 항상 좋은 신호일까</h2>',
  '<p>실제 변화</p><p>SCHD 흐름을 QQQ와 비교합니다.</p>',
  '<h2>지난 가설 복기: 맞혔는가보다 무엇을 배웠는가</h2>',
  '<p>실제 변화</p><p>지난 MSFT 가설은 AI 기대가 가격에 반영된다는 내용이었습니다. 실제로는 가격은 올랐지만 점수 변화는 약했습니다.</p>',
  '<p>해석</p><p>이는 기대가 유지됐지만 투자비 부담과 가격 부담을 함께 봐야 한다는 뜻입니다.</p>',
  '<p>초보자 레슨</p><p>예상이 맞았는지보다 어떤 전제가 약했는지 찾는 것이 더 중요합니다.</p>',
  '<p>가설 수정</p><p>다음 가설은 Azure 성장률뿐 아니라 AI 투자비와 마진 설명이 같이 좋아질 때만 유지합니다.</p>',
  '<p>다음 확인 질문</p><p>1주 뒤 가격과 점수 변화를 복기합니다.</p>',
].join('');

const weakHypothesisHtml = [
  '<h2>종목 관찰: 점수보다 질문을 먼저 보기</h2>',
  '<p>실제 변화</p><p>MSFT 1주 가격 변화는 +1.5%였습니다.</p>',
  '<p>해석</p><p>가격 변화와 점수 변화를 함께 봐야 합니다.</p>',
  '<p>초보자 레슨</p><p>좋은 회사와 좋은 가격은 서로 다른 질문입니다.</p>',
  '<p>다음 확인 질문</p><p>다음 실적에서 Azure 성장률을 확인합니다.</p>',
  '<h2>이번 주 관찰 가설 5개</h2>',
  '<p>실제 변화</p><p>QCOM 1주 가격 변화는 +41.07%였습니다.</p>',
  '<p>해석</p><p>가격이 크게 움직였습니다.</p>',
  '<p>초보자 레슨</p><p>큰 가격 변화는 숫자와 함께 봅니다.</p>',
  '<p>다음 확인 질문</p><p>다음 실적을 확인합니다.</p>',
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

const blockedWeakHypothesis = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: weakHypothesisHtml,
  source_snapshot: sourceSnapshot,
});
assert.strictEqual(blockedWeakHypothesis.status, 'blocked', 'HTML without detailed hypothesis learning markers should block');
assert(
  blockedWeakHypothesis.blocking_issues.join(' ').includes('가설 수정 기준'),
  'blocked result should name the missing hypothesis revision rule'
);

const missingForecastReviewHtml = goodHtml
  .replace('지난 MSFT 가설은 AI 기대가 가격에 반영된다는 내용이었습니다. 실제로는 가격은 올랐지만 점수 변화는 약했습니다.', '복기 데이터 미입력 5건입니다.')
  .replace('이는 기대가 유지됐지만 투자비 부담과 가격 부담을 함께 봐야 한다는 뜻입니다.', '아직 실제 결과를 기록하지 못했습니다.')
  .replace('다음 가설은 Azure 성장률뿐 아니라 AI 투자비와 마진 설명이 같이 좋아질 때만 유지합니다.', '복기 데이터 입력 후 가설을 수정합니다.');
const warnedMissingForecastReview = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: missingForecastReviewHtml,
  source_snapshot: sourceSnapshot,
});
assert.strictEqual(warnedMissingForecastReview.status, 'warning', 'missing Forecast vs Actual review should downgrade Publish QC to warning');
assert(
  warnedMissingForecastReview.warnings.join(' ').includes('WARN_FORECAST_REVIEW_MISSING'),
  'warning result should name missing forecast review data'
);

const missingEtfDataHtml = goodHtml
  .replace('SCHD 흐름을 QQQ와 비교합니다.', '주요 ETF 가격 변화: 미수집. 주요 ETF market_data가 부족합니다.');
const warnedMissingEtfData = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: missingEtfDataHtml,
  source_snapshot: sourceSnapshot,
});
assert.strictEqual(warnedMissingEtfData.status, 'warning', 'missing ETF market data should downgrade Publish QC to warning');
assert(
  warnedMissingEtfData.warnings.join(' ').includes('WARN_ETF_DATA_MISSING'),
  'warning result should name missing ETF market data'
);

const recommendationHtml = goodHtml + '<p>MSFT는 지금 사도 좋습니다.</p>';
const blockedRecommendation = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: recommendationHtml,
  source_snapshot: sourceSnapshot,
});
assert.strictEqual(blockedRecommendation.status, 'blocked', 'recommendation wording should hard block');
assert(blockedRecommendation.blocking_issues.join(' ').includes('추천'), 'blocked result should explain recommendation risk');

const safeNonRecommendationHtml = goodHtml + '<p>ETF가 강하다고 바로 매수 근거가 되는 것은 아닙니다.</p>';
const safeNonRecommendation = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: safeNonRecommendationHtml,
  source_snapshot: sourceSnapshot,
});
assert.notStrictEqual(safeNonRecommendation.status, 'blocked', 'anti-recommendation safety wording should not hard block');

const vagueInsightHtml = goodHtml + '<p>이 흐름은 다음 주에 확인해야 합니다. 시장 분위기도 주목해야 합니다.</p>';
const blockedVagueInsight = runPublishQualityGate_({
  report_id: 'RPT-TEST',
  html: vagueInsightHtml,
  source_snapshot: sourceSnapshot,
});
assert.strictEqual(blockedVagueInsight.status, 'blocked', 'vague insight wording should hard block');
assert(
  blockedVagueInsight.blocking_issues.join(' ').includes('BLOCK_VAGUE_INSIGHT'),
  'blocked result should explain vague insight language'
);

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

assert(code.includes('세이지 Publish QC 때문에 발송할 수 없습니다'), 'sendApprovedReport should guard against missing or blocked publish QC');

console.log('publish qc contract ok');
