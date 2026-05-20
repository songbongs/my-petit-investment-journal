# 2026-05-07 Weekly Lab Quality v3 Handoff

## 1. Current Status

이번 작업은 여기서 멈춘다. 현재 상태는 아래처럼 정리한다.

```text
구조 개선은 성공했다.
하지만 사용자가 기대하는 "미 증시 일타강사형 학습 리포트" 품질에는 아직 많이 부족하다.
```

이번 작업의 목적은 기존 HTML이 한 줄 요약 중심으로 퇴행하던 문제를 막고, 최소한 아래 구조가 최종 이메일 HTML에 나오도록 만드는 것이었다.

```text
실제 변화
-> 해석
-> 초보자 레슨
-> 다음 확인 질문
```

이 목적은 어느 정도 달성했다. 그러나 이것은 "콘텐츠 엔진이 좋아졌다"는 뜻이 아니라, "좋은 콘텐츠를 담을 그릇이 생겼다"는 뜻에 가깝다.

## 2. Live Execution Summary

적용된 Apps Script build marker:

```text
2026-05-07-quality-architecture-v3
```

사용자가 실행 완료한 항목:

- `showSsmkSetupBuild()`
- `setupSsmkWorkbook()`
- `forceRestartWeeklyLabFullCycleForToday()`
- `continueWeeklyLabFullCycleForToday()`

관찰된 실행 결과:

- `forceRestartWeeklyLabFullCycleForToday()`는 전체 사이클을 한 번에 처리하다가 Apps Script 실행 시간 제한에 걸렸다.
- 로그상 자료 수집, 문장 순화, 가설 복기 예약, 에이전트 리뷰까지는 진행됐다.
- 이후 `continueWeeklyLabFullCycleForToday()`를 추가해 남은 이메일 HTML 최종본 생성과 Publish QC만 이어서 실행할 수 있게 했다.
- 사용자가 `continueWeeklyLabFullCycleForToday()`를 실행했고 Apps Script 실행 화면에는 시작/완료만 보였으나, 이는 당시 v2 함수가 상세 콘솔 로그를 남기지 않았기 때문이다.
- 이후 v3에서 `Logger.log()`를 추가해 다음 실행부터는 `[SSMK continue] ...` 로그가 보이게 했다.

주의:

```text
이미 이메일 HTML 최종본이 만들어진 상태에서 continue 함수를 다시 실행하면 중복 생성을 막고 skip될 수 있다.
```

확인 위치:

- `report_versions`: 최신 `Email HTML final draft` 또는 `이메일용 HTML 최종본` 행의 `output_url`
- `qa_review_log`: `checked_by = 세이지`인 최신 Publish QC 기록
- `automation_run_log`: `weekly_lab_full_cycle_continue` 실행 결과
- `automation_step_log`: `create_email_html_final_draft` 단계 성공 여부

## 3. Code Changes Made

주요 변경 파일:

- `automation/Code.gs`
- `tests/report-builder-quality-contract.test.js`
- `tests/weekly-full-cycle-contract.test.js`
- `tests/weekly-report-html-quality-contract.test.js`
- `tests/report-fact-cards-contract.test.js`
- `tests/publish-qc-contract.test.js`
- `docs/superpowers/specs/2026-05-07-weekly-lab-quality-architecture-design.md`
- `docs/superpowers/plans/2026-05-07-weekly-lab-quality-architecture.md`

주요 구현 내용:

- `visible_title_ko`를 추가해 이메일 HTML 제목이 내부 영어 제목이 아니라 독자용 한국어 제목을 사용하게 했다.
- `contentBlock_()`, `contentBlocksFromDocsMarkdown_()`, `renderContentBlockHtml_()`를 추가했다.
- `renderWeeklyLabEmailHtml_()`가 `email_html_summary` 한 줄보다 `content_blocks`를 우선 사용하게 했다.
- `createWeeklyLabDraftReportDoc_()`가 `report_sections.content_summary`에 한 줄 요약보다 풍부한 `docs_markdown`을 우선 저장하게 했다.
- `report_fact_cards` 시트/헤더와 fact-card helper를 추가했다.
- `runPublishQualityGate_()`와 `sendApprovedReport()` 방어 로직을 추가했다.
- `continueWeeklyLabFullCycleForToday()`를 추가해 timeout 이후 HTML 최종본 생성만 이어갈 수 있게 했다.
- v3에서 continue 함수의 Apps Script 실행 로그를 보강했다.

## 4. Tests Passed

실행한 테스트:

```powershell
node tests\weekly-report-html-quality-contract.test.js
node tests\report-builder-quality-contract.test.js
node tests\weekly-full-cycle-contract.test.js
node tests\publish-qc-contract.test.js
node tests\report-fact-cards-contract.test.js
node tests\watchlist-normalization.test.js
node tests\watchlist-classification-guide.test.js
node tests\control-center-automation-dashboard.test.js
node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"
```

결과:

```text
모두 통과
```

## 5. PDF Review Of Current Output

사용자가 첨부한 결과물:

```text
C:\Users\kblife\Downloads\SSMK-reprot-draft-260507.pdf
```

PDF는 텍스트 추출이 거의 되지 않는 이미지형 PDF였으므로, 페이지 렌더링으로 직접 검토했다.

자체 평가:

```text
현재 결과물 점수: 52 / 100
이전 버전 대비: 명확히 개선
프로젝트 soul 기준: 아직 발행 품질 미달
```

좋아진 점:

- 한국어 제목이 들어갔다.
- `실제 변화`, `해석`, `초보자 레슨`, `다음 확인 질문` 구조가 보인다.
- 운영 문구가 이메일 본문에 대량 노출되는 문제는 줄었다.
- 점수와 가격 변화 일부가 본문에 들어왔다.
- 배당/ETF, Forecast vs Actual, 가설 복기, 출처와 한계 섹션이 사라지지 않는다.

아직 부족한 점:

- 문장이 여전히 "일타강사가 읽어주는 강의"가 아니라 "자동화가 만든 카드 설명"처럼 보인다.
- 데이터와 해석 사이의 인과관계가 약하다.
- "왜 이 변화가 중요한가"가 충분히 설명되지 않는다.
- 종목별 가설이 방향성, 조건, 반대 시나리오, 검증 방법을 갖춘 투자 공부용 가설로 발전하지 못했다.
- Forecast vs Actual은 아직 `아직 모름`, `실제 결과 미입력`이 많아 복기 학습의 힘이 거의 없다.
- QQQ, SCHD 등 핵심 ETF 가격 변화가 `미수집`으로 나온다. 이는 Market Map 섹션의 존재 이유를 약하게 만든다.
- `자동 시각화`가 차트라기보다 원자료 요약 카드에 가깝다.
- `이번 주 관찰 가설 5개`는 길게 나열되지만, 각 가설의 품질이 얕고 독자가 따라 배울 만한 사고 과정이 부족하다.
- 초보자 레슨이 맞는 말이기는 하지만, 대체로 일반론이다.
- 현재 리포트는 "공부의 질문 목록"에 가깝고, "시장 안목을 길러주는 주간 강의"에는 아직 못 미친다.

대표 문제 예시:

```text
시장 지도 섹션에서 QQQ/SCHD 가격 변화가 미수집으로 나오면,
성장주와 배당주의 온도차를 가르치는 핵심 수업이 성립하지 않는다.
```

```text
"가설은 정답이 아니라 나중에 맞고 틀린 이유를 복기하기 위한 질문입니다"는 방향은 맞지만,
MSFT, AAPL, QCOM 같은 실제 종목별로 어떤 전제가 맞으면 가설이 강화되고,
어떤 데이터가 나오면 가설을 버려야 하는지까지 가지 못한다.
```

## 6. Updated North Star From User Feedback

다음 작업의 기준은 아래 문장이다.

```text
미 증시 일타강사가 초보자에게 데이터를 기반으로 팩트를 읽어주고,
그 팩트를 어떻게 해석해야 하는지 알려주고,
이를 기반으로 종목의 방향성에 대한 가설을 세우고,
시간이 지나며 그 가설이 얼마나 맞았는지 함께 검증하고,
검증 결과를 바탕으로 가설을 다듬거나 새 가설을 만드는 리포트.
```

더 쉽게 말하면:

```text
매주 읽으면 미 증시를 보는 눈이 좋아지는 공부 자료여야 한다.
```

현재 v3는 이 목표의 "양식"만 일부 갖췄고, "강의력"은 아직 부족하다.

## 7. Next Work: Recommended Architecture

다음 작업은 단순 문장 다듬기가 아니라 콘텐츠 생성 아키텍처를 한 단계 올리는 작업이어야 한다.

### 7-1. Generic Block Extraction 중단

현재는 Docs용 markdown에서 `실제 변화`, `해석`, `초보자 레슨`, `다음 확인 질문`을 추출해 HTML 카드로 만든다.

이 방식은 빠르게 구조를 복구하는 데는 좋았지만, 깊이 있는 강의형 콘텐츠를 만들기에는 한계가 있다.

다음에는 섹션별 전용 builder가 필요하다.

예:

- `buildMarketMapTeachingInsight_()`
- `buildStockObservationTeachingCard_()`
- `buildHypothesisTeachingCard_()`
- `buildForecastReviewTeachingCard_()`
- `buildDividendEtfTeachingCard_()`

각 builder는 단순한 문장 조립이 아니라 아래 구조를 만들어야 한다.

```text
핵심 팩트
-> 초보자가 놓치기 쉬운 해석 포인트
-> 가능한 가설
-> 가설이 맞으려면 다음에 확인되어야 할 데이터
-> 가설이 틀릴 수 있는 반대 조건
```

### 7-2. Data Coverage 우선 보강

현재 리포트의 가장 큰 약점 중 하나는 데이터가 부족한 상태에서 교육 콘텐츠를 만들려고 한다는 점이다.

우선순위 데이터:

1. 주요 시장 ETF와 지수
   - SPY
   - QQQ
   - SCHD
   - XLK
   - XLE
   - 필요 시 IWM, DIA, VIX 대체 지표

2. 종목별 가격 변화
   - 1주
   - 4주
   - 가능하면 13주

3. 종목별 뉴스 이벤트
   - 실적
   - 가이던스
   - 제품/규제/인수합병
   - analyst narrative는 2차 우선순위

4. 기초 펀더멘털
   - 매출 성장
   - 영업이익률 또는 마진
   - EPS
   - FCF
   - 부채 또는 현금

5. 배당/ETF
   - 배당수익률
   - 배당성향
   - FCF 대비 배당 여력
   - ETF 상위 보유 종목
   - ETF 스타일 차이

핵심:

```text
데이터가 부족하면 좋은 리포트를 만들 수 없다.
다만 부족한 데이터도 "무엇이 부족해서 판단을 보류해야 하는지"를 가르치는 재료로 써야 한다.
```

### 7-3. Hypothesis Card를 새로 정의

현재 가설은 아직 긴 문장 나열에 가깝다.

다음 가설 구조는 아래처럼 명확해야 한다.

```text
가설 제목
관찰된 팩트
이 팩트를 이렇게 해석하는 이유
가능한 방향성
이 가설이 맞으려면 확인되어야 할 데이터
이 가설이 틀릴 수 있는 반대 증거
복기 시점
초보자가 배울 점
```

예시 형식:

```text
MSFT 가설:
최근 4주 주가는 강했지만 1주 흐름은 약해졌다.
이는 AI 기대가 여전히 남아 있지만 단기적으로는 가격 부담이나 실적 확인 욕구가 커졌다는 신호일 수 있다.
다음 실적에서 Azure 성장률과 AI 투자비 설명이 기대보다 강하면 가설은 강화된다.
반대로 마진 부담이 커지거나 성장률이 둔화되면 "좋은 회사지만 가격이 앞서갔다"는 쪽으로 가설을 수정해야 한다.
```

### 7-4. Forecast vs Actual을 리포트의 핵심 루프로 승격

현재 Forecast vs Actual은 형식적으로 들어가 있지만, 실제 학습 효과가 약하다.

다음에는 아래가 필요하다.

- 가설 생성 시점에 `review_window`와 `review_condition`을 반드시 저장
- 1주 뒤, 4주 뒤에 자동으로 실제 결과를 채움
- 결과를 `맞음/틀림`보다 아래처럼 분류
  - 방향은 맞았지만 이유가 틀림
  - 이유는 맞았지만 시간이 더 필요
  - 데이터가 부족해 판단 보류
  - 완전히 틀림
- 틀린 이유를 새 가설로 연결

즉:

```text
리포트는 매주 새 이야기를 만드는 것이 아니라,
지난 질문을 복기하면서 투자 공부의 눈을 누적시키는 시스템이어야 한다.
```

### 7-5. Publish QC를 "구조 QC"에서 "강의 품질 QC"로 확장

현재 Publish QC는 아래를 잡는다.

- 추천성 표현
- 핵심 섹션 누락
- 운영 문구 노출
- 최소 구조

다음에는 아래를 점수화해야 한다.

```text
팩트 구체성
숫자 보존
해석의 인과관계
초보자 설명력
가설의 검증 가능성
반대 시나리오 포함 여부
복기 가능성
일반론/템플릿 문장 비율
```

차단 조건 예:

```text
섹션에 숫자나 실제 변화가 없으면 blocked
가설에 반대 조건이 없으면 warning
Forecast vs Actual이 "아직 모름"만 반복되면 warning 또는 blocked
Market Map에서 QQQ/SCHD/SPY가 모두 미수집이면 blocked
```

### 7-6. 이메일 구성도 다시 조정

현재 리포트는 섹션이 많고 모두 비슷한 카드 구조라 강약이 약하다.

다음 추천 구조:

```text
1. 이번 주 한 문장 시장 강의
2. 시장 지도: 성장/배당/기술/에너지 온도차
3. 이번 주 Top 3 종목 깊게 보기
4. 핵심 가설 3~5개
5. 지난 가설 복기
6. 배당 & ETF 코너
7. 이번 주에 배운 투자 공부 질문
```

Top 20을 모두 길게 쓰기보다, 초보자가 실제로 배울 수 있는 Top 3 깊이가 더 중요하다.

## 8. Recommended Next Implementation Plan

다음 작업은 아래 순서가 좋다.

### Step 1. 현재 PDF를 기준으로 품질 테스트 만들기

새 테스트:

```text
tests/weekly-teacher-quality-contract.test.js
```

테스트 기준:

- Market Map에는 SPY/QQQ/SCHD/XLK/XLE 중 최소 3개 가격 변화가 있어야 한다.
- Stock Deep Dive에는 Top 3 각각에 대해 방향성 가설이 있어야 한다.
- 각 가설에는 반대 조건과 복기 시점이 있어야 한다.
- Forecast vs Actual은 "아직 모름"만 있으면 warning 또는 fail이어야 한다.
- "좋은 회사와 좋은 가격은 다른 질문" 같은 일반론만 반복하면 fail이어야 한다.

### Step 2. ETF/시장 데이터 보강

`market_data`가 watchlist에만 의존하지 않게 하고, 주요 ETF는 항상 수집되게 한다.

### Step 3. Top 3 종목 전용 teaching card 구현

처음부터 모든 섹션을 고치지 말고, 아래 둘만 먼저 깊게 만든다.

- `market_map`
- `stock_dashboard` 또는 `lens_deep_dive`

### Step 4. Hypothesis lifecycle 고도화

가설 생성, 복기 예약, 결과 기록, 가설 수정이 하나의 루프로 연결되게 한다.

### Step 5. Publish QC 강화

문장 품질과 가설 검증 가능성을 점수화한다.

## 9. Do Not Break

다음 작업자는 아래를 건드릴 때 매우 조심해야 한다.

- `email_auto_send`는 기본 OFF 유지
- 이메일 발송은 사용자 승인 후에만 가능
- `scheduledWeeklyLabTrigger()` 연결 유지
- `getWeeklyLabScheduleConfig_()`의 요일/시간 하드코딩 회피 유지
- `collectAndStoreWeeklyBackData_()`와 `collectAndStoreNewsEvents_()`는 성능/데이터 보강 목적이 분명할 때만 수정
- 기존 watchlist taxonomy는 보존
- `setupSsmkWorkbook()`의 가벼운 실행 흐름 유지
- timeout이 날 수 있으므로 전체 사이클을 한 함수에 계속 몰아넣지 말 것

## 10. Restart Prompt For Next Work

다음에 Codex에게 그대로 붙여넣을 수 있는 재시작 프롬프트:

```text
SSMK Weekly Lab 품질 고도화 작업을 이어가자.
먼저 docs/SSMK-WEEKLY-LAB-SOUL.md와 docs/2026-05-07-weekly-lab-quality-v3-handoff.md를 읽고, 첨부/보관된 2026-05-07 PDF 결과물이 왜 아직 "미 증시 일타강사형 초보자 학습 리포트"에 못 미치는지 다시 확인해줘.

이번 목표는 구조를 더 만드는 것이 아니라 콘텐츠의 강의력을 높이는 것이다.
우선 Market Map과 Top 3 종목 deep dive부터 TDD로 개선하자.
주요 ETF 시장 데이터가 미수집으로 나오지 않게 하고, 각 종목에는 팩트 -> 해석 -> 방향성 가설 -> 반대 조건 -> 복기 시점을 포함한 teaching card를 만들자.
기존 자동화, 승인 전 발송 차단, 스케줄 설정, watchlist taxonomy는 깨지 않도록 영향도 분석 후 진행해줘.
```

