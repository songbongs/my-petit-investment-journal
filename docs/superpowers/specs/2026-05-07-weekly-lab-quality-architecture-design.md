# SSMK Weekly Lab Quality Architecture Design

작성일: 2026-05-07

## 1. 목적

이번 설계의 목적은 SSMK Weekly Lab이 프로젝트의 soul에 맞는 학습형 리서치 시스템으로 흔들리지 않게 만드는 것이다.

이 작업은 목차를 더 많이 만들거나 문장을 조금 고치는 작업이 아니다. 핵심은 아래 실패가 다시 발생하지 않게 하는 것이다.

```text
좋은 기준 문서가 있음
→ 실제 실행 경로에는 일부만 반영됨
→ 이메일 HTML은 한 줄 요약 중심으로 생성됨
→ QA는 구조와 상태값만 보고 통과 처리함
→ 초보자가 배울 수 없는 리포트가 발행 후보가 됨
```

따라서 이번 개선은 아래 원칙을 코드와 테스트의 통과 조건으로 만든다.

```text
좋은 소스
→ 확인 가능한 사실
→ 점수와 해석의 근거
→ 초보자용 콘텐츠
→ 독립 레드팀 QC
→ 사용자 승인
→ 발송
```

초보자용으로 말하면:

```text
앞으로는 "그럴듯한 리포트 문장"이 아니라
"확인된 데이터에서 출발해 초보자가 배울 수 있는 문장"만
발행 후보가 되게 만든다.
```

## 2. 반드시 지켜야 할 기존 기능

이번 품질 개선은 기존 자동화 엔진을 갈아엎는 작업이 아니다. 아래 기능은 보호 대상이다.

| 보호 대상 | 현재 역할 | 변경 원칙 |
|---|---|---|
| `scheduledWeeklyLabTrigger()` | 정기 실행 진입점 | 기존 연결 유지 |
| `runWeeklyLabFullCycle()` | 전체 사이클 오케스트레이션 | 단계 순서 보존, 새 QC는 후단에 추가 |
| `collectAndStoreWeeklyBackData_()` | 시장 가격 데이터 수집 | 직접 수정하지 않음 |
| `collectAndStoreNewsEvents_()` | 뉴스 후보 수집 | 직접 수정하지 않음 |
| `buildWeeklyScoresFromBackData_()` | 주간 점수 생성 | 기존 점수 계산 유지 |
| `automation_run_log` / `automation_step_log` | 실행 추적 | 의미 변경 금지 |
| `error_log` / `bottleneck_log` | 장애 추적 | 의미 변경 금지 |
| `revision_requests` | 사용자 수정 요청 | 기존 흐름 유지 |
| `sendApprovedReport()` | 승인 후 발송 | 함수 자체 보존, 승인 조건만 강화 |
| `email_auto_send` | 자동 발송 제어 | 기본 OFF 유지 |
| `weekly_lab_primary_schedule` | 중립 스케줄 키 | 기존 fallback 유지 |

수정은 새 콘텐츠 품질 레이어에 집중한다. 기존 수집, 점수, 로그, 승인, 발송 흐름은 새 레이어가 읽거나 차단 조건으로 참고할 수는 있지만, 먼저 구조를 바꾸지 않는다.

## 3. 현재 실패 원인

### 3-1. 좋은 기준이 최종 HTML까지 내려오지 않는다

현재 코드에는 `learningFlowMarkdown_()`가 있어 Docs 초안에는 아래 구조가 일부 만들어진다.

```text
실제 변화
→ 해석
→ 초보자 레슨
→ 다음 확인 질문
```

하지만 최종 이메일 HTML은 `email_html_summary`를 우선 사용한다.

```text
email_html_summary가 있으면 docs_markdown은 HTML에 거의 들어가지 않는다.
```

그 결과 Docs 초안에 있는 비교적 긴 학습 구조도 독자용 HTML에서는 한 줄 요약으로 납작해진다.

### 3-2. 섹션 제목이 내부 키와 독자용 제목을 구분하지 못한다

`section_key`는 영어 내부 키여도 된다. 그러나 독자에게 보이는 제목은 쉬운 한국어여야 한다.

나쁜 예:

```text
Executive Dashboard
Market Map
SSMK Lens Deep Dive
Hypothesis Lab
```

좋은 예:

```text
이번 주 시장 한눈에: 어디에 힘이 실렸나
시장 지도: QQQ와 SCHD가 말해주는 위험 선호
SSMK 렌즈: 대표 종목을 천천히 해부하기
이번 주 관찰 가설 5개
```

### 3-3. QA 점수가 콘텐츠 품질 점수가 아니다

현재 `content_quality_score`는 실제 HTML 문장을 읽는 점수가 아니라, 실행 상태, 에이전트 상태, 섹션 row 상태의 평균에 가깝다.

따라서 아래 문제가 있어도 높은 점수가 나올 수 있다.

- 최종 HTML이 한 줄 요약뿐이다.
- 숫자가 해석으로 이어지지 않는다.
- 초보자 레슨이 일반론이다.
- Dividend & ETF Corner가 placeholder에 가깝다.
- Forecast vs Actual이 복기 학습으로 작동하지 않는다.

### 3-4. 테스트가 실제 결과물을 검증하지 않는다

기존 테스트는 함수와 문자열의 존재를 주로 확인한다.

필요하지만 충분하지 않은 검사:

- 리포트 빌더 함수가 있는가?
- 필수 section_key가 있는가?
- 예전 금지 문구 하나가 제거됐는가?
- 운영 문구가 특정 함수 body에 직접 없는가?

새로 필요한 검사:

- 샘플 데이터로 실제 HTML을 만들었을 때 독자용 한국어 제목이 나오는가?
- 각 핵심 섹션에 실제 변화, 해석, 초보자 레슨, 다음 확인 질문이 있는가?
- 샘플 숫자와 종목명이 HTML까지 보존되는가?
- `email_html_summary` 때문에 본문이 잘려 나가지 않는가?
- 세이지 QC 없이 승인/발송이 불가능한가?

## 4. 목표 아키텍처

새 흐름은 아래와 같다.

```text
Source Registry
→ Raw Data
→ Fact Card
→ Signal Card
→ Content Block
→ 루미 콘텐츠 작성
→ Docs / HTML 렌더링
→ 세이지 Publish QC
→ 사용자 승인
→ 이메일 발송
→ Forecast vs Actual 복기
```

각 레이어의 역할은 분명해야 한다.

| 레이어 | 역할 | 쓰면 안 되는 일 |
|---|---|---|
| Source Registry | 출처와 신뢰도 정의 | 콘텐츠 문장 작성 |
| Raw Data | 수집된 원자료 저장 | 해석 |
| Fact Card | 문장에 쓸 수 있는 확인된 사실 정리 | 없는 데이터 추측 |
| Signal Card | fact를 학습 질문으로 변환 | 투자 판단 |
| Content Block | 섹션별 의미 단위 저장 | HTML 스타일링 |
| 루미 | Content Block을 쉬운 한국어 문단으로 작성 | 숫자 창작 |
| Renderer | Docs/HTML/대시보드 출력 분리 | 새로운 해석 생성 |
| 세이지 QC | 최종 HTML과 원자료 대조 | 작성자 역할 겸임 |
| 파일럿 | 승인/발송/복기 상태 관리 | 콘텐츠 품질 판정 |

## 5. 데이터 레이어 설계

### 5-1. Source Registry

기존 `source_policy`, `data_sources`를 우선 활용한다.

출처 신뢰도 기준:

| 등급 | 예시 | 사용 원칙 |
|---|---|---|
| 높음 | SEC 공시, 기업 IR, ETF 운용사 자료 | 핵심 fact 근거 가능 |
| 중간 | GOOGLEFINANCE 가격 데이터, 주요 언론 기사 | 가격/뉴스 후보 근거 가능 |
| 낮음 | AI 요약, 출처 불명 요약 | 확정 문장 금지 |

### 5-2. Raw Data

기존 탭을 우선 보호하고 재사용한다.

| 탭 | 사용 |
|---|---|
| `market_data` | 가격 변화, ETF 흐름 |
| `news_events` | 뉴스 후보 |
| `watchlist` | 산업, 테마, 투자 성격 |
| `weekly_scores` | 점수, 관찰 등급, 가설 입력 |
| `company_fundamentals` | 실적/재무 |
| `revenue_breakdown` | 매출 구성 |
| `shareholder_returns` | 배당/자사주 |
| `etf_watch` | ETF 특성 |
| `hypothesis_reviews` | Forecast vs Actual |

### 5-3. Fact Card

1차 구현에서 새 탭을 추가한다.

```text
report_fact_cards
```

1차 구현 컬럼:

```text
fact_id
issue_date
report_id
section_key
ticker
asset_type
fact_type
metric_name
period
value
unit
comparison_value
comparison_label
source_key
source_url
source_date
data_confidence
data_status
missing_reason
notes
```

예시:

```text
fact_id: FACT-20260507-MSFT-PRICE-1W
section_key: stock_dashboard
ticker: MSFT
fact_type: price_change
metric_name: 1주 가격 변화
period: 1w
value: +1.53
unit: %
source_key: googlefinance_price
data_confidence: medium
data_status: present
missing_reason:
notes: 가격 변화는 학습 질문의 출발점이며 투자 판단이 아니다.
```

### 5-4. 데이터 상태

모든 중요한 fact는 아래 상태 중 하나를 가져야 한다.

| 상태 | 의미 | 문장 원칙 |
|---|---|---|
| `present` | 확인됨 | 수치와 기준일을 함께 쓴다 |
| `missing` | 이번 자동 수집에서 없음 | 부족하다고 명시한다 |
| `stale` | 오래된 데이터 | 최신 확인 필요를 쓴다 |
| `conflict` | 출처끼리 다름 | 단정 금지 |
| `not_applicable` | 해당 없음 | 억지로 해석하지 않는다 |

## 6. 콘텐츠 레이어 설계

### 6-1. Content Block

1차 구현에서는 Apps Script 내부 모델로 먼저 도입한다. 별도 시트 탭은 만들지 않는다.

```text
content_blocks
```

필수 필드:

```text
block_id
issue_date
report_id
section_key
visible_title_ko
reader_question
source_fact_ids
actual_change
interpretation
beginner_lesson
counter_question
next_check
missing_data_note
data_confidence
render_targets
status
qa_flags
```

이 모델이 최종 콘텐츠의 원본이다. `email_html_summary`는 원본이 아니라 미리보기 문장으로만 사용한다.

### 6-2. 좋은 문장 조건

좋은 핵심 문장은 최소한 아래를 포함한다.

```text
숫자 또는 확인된 사실
→ 비교 기준
→ 해석
→ 초보자 레슨
→ 다음 확인
```

나쁜 문장:

```text
MSFT는 AI와 클라우드 흐름을 통해 관찰 우선순위를 확인합니다.
```

좋은 문장:

```text
MSFT는 이번 주 1주 가격 변화가 플러스였지만, SSMK 점수는 전주보다 낮아졌습니다.
이는 AI 기대가 여전히 강하더라도 가격 부담이나 투자비 부담을 함께 봐야 한다는 신호일 수 있습니다.
초보자는 여기서 좋은 회사와 좋은 가격은 서로 다른 질문이라는 점을 배울 수 있습니다.
다음 실적 발표에서는 Azure 성장률과 AI 투자비 설명을 함께 확인해야 합니다.
```

### 6-3. 섹션별 최소 품질 기준

| 섹션 | 최소 기준 |
|---|---|
| 이번 주 한 줄 결론 | 시장 분위기와 학습 포인트가 함께 있어야 함 |
| 시장 지도 | SPY, QQQ, SCHD, XLK, XLE 중 최소 2개 비교 |
| 산업/테마 보드 | 산업, 테마, 투자 성격 분리 |
| 종목 관찰 | 총점뿐 아니라 점수 요인과 데이터 신뢰도 설명 |
| SSMK Lens | Top 1~2개 종목을 최소 3개 렌즈로 설명 |
| Hypothesis Lab | 가설 5개 또는 부족 사유와 보강 계획 |
| Dividend & ETF Corner | 누락 금지, 데이터 부족도 학습 포인트로 설명 |
| Forecast vs Actual | 지난 가설이 없으면 복기 구조와 다음 기록 기준 설명 |
| 이번 주 레슨 | 실제 종목/ETF 사례와 연결 |
| 다음 확인 질문 | 1주/4주 뒤 확인할 지표를 질문형으로 작성 |

## 7. 렌더링 설계

### 7-1. Docs 초안

Docs는 편집자용이다.

포함:

- Content Block 전체
- 원자료와 fact id
- 부족한 데이터
- QA 메모
- 수정 요청
- 발행 전 체크리스트

### 7-2. 이메일 HTML

이메일은 독자용이다.

포함:

- 쉬운 한국어 제목
- 독자 질문
- 실제 변화
- 해석
- 초보자 레슨
- 다음 확인 질문
- 짧은 출처/한계
- 면책 문구

제외:

- QA 상태
- `blocked`
- `error_log`
- `bottleneck_log`
- 운영 체크리스트
- 내부 run id 중심의 운영 설명

### 7-3. 운영 대시보드

대시보드는 운영자용이다.

포함:

- 실행 성공/경고/실패
- 세이지 QC 상태
- blocked 사유
- 다음 액션
- 발송 가능 여부

독자용 긴 콘텐츠는 대시보드에 넣지 않는다.

## 8. 세이지 Publish QC Gate

세이지는 작성자가 아니라 발행 직전 출고검사원이다.

QC 위치:

```text
원자료 수집
→ Content Block 생성
→ Docs 초안 생성
→ 이메일 HTML 생성
→ 세이지 Publish QC
→ 사용자 승인 가능 여부 결정
→ 승인 상태일 때만 발송
```

### 8-1. QC 점수

```text
final_qc_score =
  원자료 대조 30
+ 필수 구조 15
+ 학습 흐름 20
+ 안전/추천화 방지 20
+ 데이터 한계 표시 10
+ HTML 출력 분리 5
```

판정:

```text
blocked = hard block 1개 이상 또는 final_qc_score < 70
warning = hard block 없음 + 70~84점
pass    = hard block 없음 + 85점 이상
```

추가 하한:

```text
원자료 대조 < 24/30이면 pass 불가
안전/추천화 방지 < 18/20이면 pass 불가
```

### 8-2. Hard Block 기준

아래는 점수와 무관하게 발행 차단이다.

- 매수/매도/추천/지금 사도 좋다/수익 보장처럼 읽히는 표현
- 핵심 수치가 원자료와 다름
- 출처 없는 실적, 배당성향, FCF, ETF 보유비중을 사실처럼 씀
- 데이터가 없는데 확인됐다, 강하다, 입증됐다처럼 단정함
- Dividend & ETF Corner 누락
- Forecast vs Actual 누락
- 영어 내부 제목이 최종 HTML에 노출됨
- 최종 HTML에 QA 상태, blocked, error_log, bottleneck_log, 발행 전 체크리스트 노출
- 최신 세이지 QC 결과 없이 승인 상태로 변경

### 8-3. 기록 위치

1차 구현에서는 기존 `qa_review_log`를 확장해서 사용한다. `publish_qc_results`라는 별도 탭은 이번 작업에 만들지 않는다.

추가 권장 필드:

```text
report_id
html_version_id
source_snapshot_id
checked_by
blocked_count
warning_count
qc_score_breakdown
```

`report_runs.notes`에는 짧은 요약을 남긴다.

예시:

```text
sage_qc_status=blocked; score=62; qa_id=QA-20260507-...; blocking=3; warning=2; html_version=v1
```

## 9. 승인과 발송

이메일 자동 발송은 계속 기본 OFF다.

승인 조건:

```text
최신 세이지 QC = pass
또는
최신 세이지 QC = warning 이고 사용자가 명시적으로 인지 후 승인
```

발송 금지:

```text
최신 세이지 QC = blocked
세이지 QC 없음
HTML 버전이 QC 이후 변경됨
report_runs.generation_status가 승인 아님
email_auto_send가 OFF인데 자동 발송 시도
```

중요:

```text
HTML 파일 생성은 발송 승인이 아니다.
revision_requests 저장도 발송 승인이 아니다.
세이지 QC pass도 자동 발송 승인이 아니다.
최종 발송은 사용자 승인 후에만 가능하다.
```

## 10. 테스트 전략

이번 구현은 TDD로 진행한다.

### 10-1. 기존 테스트 유지

아래 테스트는 회귀 방어선으로 유지한다.

```text
tests/weekly-full-cycle-contract.test.js
tests/report-builder-quality-contract.test.js
tests/control-center-automation-dashboard.test.js
tests/watchlist-normalization.test.js
tests/watchlist-classification-guide.test.js
```

### 10-2. 새 계약 테스트

추가할 테스트:

1. 샘플 데이터로 실제 HTML을 생성하면 한국어 독자 제목이 나온다.
2. 최종 HTML은 `email_html_summary` 한 문장만으로 구성되지 않는다.
3. 핵심 섹션마다 실제 변화, 해석, 초보자 레슨, 다음 확인 질문이 있다.
4. 샘플 fact 수치와 ticker가 HTML까지 보존된다.
5. 영어 내부 제목이 최종 HTML에 노출되면 실패한다.
6. Dividend & ETF Corner가 누락되면 QC blocked다.
7. Forecast vs Actual이 누락되면 QC blocked다.
8. 운영 문구가 HTML에 섞이면 QC blocked다.
9. 추천처럼 읽히는 표현이 있으면 QC blocked다.
10. 최신 세이지 QC 없이 승인/발송이 불가능하다.

### 10-3. 테스트 예시 문장

PASS 예:

```text
MSFT는 이번 주 1주 가격 변화가 +1.5%였지만, SSMK 점수는 8.2에서 7.6으로 낮아졌습니다.
이는 좋은 회사라도 가격 부담과 AI 투자비 부담을 함께 봐야 한다는 신호일 수 있습니다.
초보자는 좋은 회사와 좋은 가격이 서로 다른 질문이라는 점을 배울 수 있습니다.
다음 실적 발표에서는 Azure 성장률과 AI 투자비 설명을 확인해야 합니다.
```

FAIL 예:

```text
MSFT는 AI 투자비와 Azure 성장률을 통해 관찰 우선순위를 확인합니다.
```

## 11. 구현 슬라이스

### Slice 1. 테스트 기반 보호선 추가

목표:

```text
현재 실패를 재현하는 테스트를 먼저 만든다.
```

작업:

- 실제 HTML 샘플 생성 테스트 추가
- 영어 제목 노출 실패 테스트 추가
- 한 줄 요약 HTML 실패 테스트 추가
- QC blocked 테스트 추가

이 단계에서는 production code를 바꾸지 않는다.

### Slice 2. 독자용 제목 분리

목표:

```text
section_key는 유지하고 visible_title_ko를 추가한다.
```

작업:

- `report_blueprint`에 표시 제목 컬럼 추가 또는 내부 fallback map 추가
- seed 기본값은 한국어 독자 질문형 제목으로 설정
- 기존 section_key 기반 로직은 유지

### Slice 3. Content Block 모델 도입

목표:

```text
최종 콘텐츠 원본을 email_html_summary에서 Content Block으로 전환한다.
```

작업:

- 내부 `contentBlock_` helper 추가
- 섹션 빌더가 actual_change, interpretation, beginner_lesson, next_check를 반환
- `email_html_summary`는 미리보기 용도로 격하

### Slice 4. HTML 렌더러 수정

목표:

```text
HTML이 Content Block의 학습 흐름을 렌더링하게 한다.
```

작업:

- `<h2>`는 `visible_title_ko` 사용
- 본문은 실제 변화, 해석, 레슨, 다음 확인 질문을 분리 렌더링
- 운영 문구 차단 유지

### Slice 5. Fact Card와 missing data 연결

목표:

```text
문장의 근거와 누락 데이터를 명시한다.
```

작업:

- `report_fact_cards` 추가 또는 내부 모델 우선 도입
- market_data, weekly_scores, watchlist에서 fact card 생성
- missing/stale/conflict 상태를 Content Block에 연결

### Slice 6. 세이지 Publish QC Gate

목표:

```text
최종 HTML과 원자료를 검사해 발행 후보 여부를 판정한다.
```

작업:

- `runPublishQualityGate_()` 추가
- hard block 검사 추가
- 점수 breakdown 기록
- `qa_review_log`와 `report_runs.notes` 기록

### Slice 7. 승인/발송 조건 강화

목표:

```text
blocked 리포트와 QC 없는 리포트는 발송될 수 없게 한다.
```

작업:

- 승인 함수에서 최신 세이지 QC 확인
- `sendApprovedReport()` 전 최종 방어선 추가
- warning 발송은 사용자 명시 승인 필요

## 12. 서브 에이전트 실행 방식

구현은 Subagent-Driven 방식이 적합하다.

| 에이전트 | 책임 | 쓰기 범위 |
|---|---|---|
| Worker 1 | 테스트/fixture 작성 | `tests/*` |
| Worker 2 | Content Block/HTML renderer | `automation/Code.gs`의 리포트 빌더 범위 |
| Worker 3 | Fact Card/missing data | `automation/Code.gs`의 context/model 범위 |
| Worker 4 | Publish QC/approval guard | `automation/Code.gs`의 QA/approval/send 범위 |
| 메인 Codex | 통합, 충돌 해결, Apps Script push 전 검증 | 전체 리뷰 |

각 worker는 서로의 변경을 되돌리지 않는다. 파일이 겹치는 `automation/Code.gs`는 함수 범위 소유권을 명확히 나누고, 통합은 메인 Codex가 한다.

## 13. 검증 명령

로컬 최소 검증:

```powershell
node tests\watchlist-normalization.test.js
node tests\watchlist-classification-guide.test.js
node tests\control-center-automation-dashboard.test.js
node tests\weekly-full-cycle-contract.test.js
node tests\report-builder-quality-contract.test.js
node tests\weekly-report-html-quality-contract.test.js
node tests\publish-qc-contract.test.js
node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"
```

Apps Script 반영 전 확인:

```powershell
npx -y @google/clasp show-file-status
```

Apps Script 반영:

```powershell
npx -y @google/clasp push --force
```

라이브 검증은 사용자 실행 로그로 확인한다.

권장 순서:

```text
showSsmkSetupBuild()
→ setupSsmkWorkbook()
→ forceRestartWeeklyLabFullCycleForToday()
→ createEmailFinalReportDraft(report_id)
→ runPublishQualityGate(report_id)
→ approve/send 단계는 blocked가 아닌 경우에만 별도 확인
```

## 14. 롤백 원칙

이번 개선은 additive 우선이다.

롤백을 쉽게 하기 위해:

- 기존 탭 컬럼 삭제 금지
- 기존 함수명 삭제 금지
- 기존 `section_key` 변경 금지
- 기존 수집/점수 함수 직접 수정 금지
- 새 기능은 새 helper와 새 테스트로 감싼다

문제가 생기면:

```text
HTML 렌더러와 Publish QC 연결을 끄고
기존 Docs 초안 생성과 report_runs 기록은 계속 유지한다.
```

발송은 사용자 승인 전까지 계속 OFF이므로, 품질 개선 실패가 실제 이메일 오발송으로 이어지지 않게 한다.

## 15. 승인 기준

구현이 완료됐다고 말하려면 아래를 모두 통과해야 한다.

1. 기존 5개 테스트 통과.
2. 새 HTML 품질 테스트 통과.
3. 새 Publish QC 테스트 통과.
4. 최종 HTML에 한국어 독자 제목이 표시됨.
5. 최종 HTML이 한 줄 요약이 아니라 학습 블록을 포함함.
6. Dividend & ETF Corner와 Forecast vs Actual이 누락되면 blocked 됨.
7. 최신 세이지 QC 없이 승인/발송이 불가능함.
8. email_auto_send는 계속 OFF.
9. live Apps Script push 후 사용자 실행 로그에서 blocked/warning/pass가 확인됨.

## 16. 비범위

이번 작업에서 하지 않는 것:

- 시장 데이터 수집 방식을 전면 교체하지 않는다.
- SEC/ETF 운용사 API 전체 자동화를 한 번에 완성하지 않는다.
- 이메일 자동 발송을 ON으로 바꾸지 않는다.
- 기존 dashboard UI를 대대적으로 재설계하지 않는다.
- 기존 watchlist taxonomy를 다시 바꾸지 않는다.
- 기존 스코어링 산식을 새 투자 모델로 바꾸지 않는다.

이번 목표는 좋은 콘텐츠가 나올 수 있는 안전한 품질 파이프라인을 먼저 만드는 것이다.
