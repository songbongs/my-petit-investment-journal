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
  vm.runInContext(
    `${code}\nthis.__api = { SSMK, getWatchlistClassificationGuide };`,
    context
  );
  return context.__api;
}

function testGuideHasApprovedLearningLabels() {
  const api = loadApi();
  const guide = api.getWatchlistClassificationGuide();
  const byTicker = Object.fromEntries(guide.map((row) => [row.ticker, row]));

  assert.strictEqual(guide.length, 20);
  assert.strictEqual(byTicker.MSFT.core_industry, 'AI/클라우드/반도체 인프라');
  assert.match(byTicker.MSFT.theme_tags, /게임/);
  assert.match(byTicker.MSFT.theme_tags, /Azure/);
  assert.match(byTicker.MSFT.investment_style, /플랫폼/);
  assert.match(byTicker.MSFT.role_in_watchlist, /Xbox\/Activision/);
}

function testGuideUsesTheSevenApprovedIndustryBuckets() {
  const api = loadApi();
  const guide = api.getWatchlistClassificationGuide();
  const allowedIndustries = new Set([
    'AI/클라우드/반도체 인프라',
    '디지털 플랫폼/광고',
    '미디어/게임/콘텐츠',
    '자동차/전기차',
    '헬스케어/제약',
    '에너지/산업소재',
    '글로벌 소비재/럭셔리',
  ]);

  guide.forEach((row) => {
    assert.ok(allowedIndustries.has(row.core_industry), `${row.ticker} has unexpected core_industry`);
    assert.ok(row.theme_tags, `${row.ticker} is missing theme_tags`);
    assert.ok(row.investment_style, `${row.ticker} is missing investment_style`);
    assert.ok(row.role_in_watchlist, `${row.ticker} is missing role_in_watchlist`);
  });
}

function testGuideAvoidsRecommendationLanguage() {
  const api = loadApi();
  const guide = api.getWatchlistClassificationGuide();
  const riskyPattern = /(매수|매도|사야|팔아야|수익\s*보장|확실한\s*기회)/;

  guide.forEach((row) => {
    const text = [
      row.core_industry,
      row.theme_tags,
      row.investment_style,
      row.role_in_watchlist,
    ].join(' ');
    assert.ok(!riskyPattern.test(text), `${row.ticker} has recommendation-like wording`);
  });
}

testGuideHasApprovedLearningLabels();
testGuideUsesTheSevenApprovedIndustryBuckets();
testGuideAvoidsRecommendationLanguage();
console.log('watchlist classification guide tests passed');
