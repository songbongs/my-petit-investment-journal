# SSMK Weekly Lab 콘텐츠/자동화 재설계

작성일: 2026-04-23  
상태: 사용자 검토 대기  
범위: 콘텐츠 구조, Google Sheets 데이터 구조, 설정 UI, 자동화 운영 구조

## 1. 목적

SSMK 투자 관찰노트는 투자 추천서가 아니라, 초보자가 미국주식과 시장 흐름을 같은 기준으로 반복 관찰하며 투자 판단력을 기르는 학습형 리서치 프로젝트다.

기존 샘플은 점수와 짧은 가설 중심이라, 다음 문제가 있었다.

- 시각화가 약해 시장 흐름과 변화 추이가 한눈에 들어오지 않았다.
- 가설과 근거 지표가 너무 짧아 실제 분석처럼 느껴지지 않았다.
- 문장이 두루뭉실해 핵심 판단과 예측 조건이 분명하지 않았다.
- 종목명, 용어, 지표 설명이 초보자에게 충분히 친절하지 않았다.
- SSMK score가 어떤 요인으로 만들어졌는지 분해 설명이 부족했다.
- 산업, 테마, 배당주, ETF가 리포트 구조 안에서 충분히 다뤄지지 않았다.
- 에이전트들이 서로의 작업물을 유기적으로 검토하고 재작업하는 흐름이 약했다.

이번 재설계의 목표는 아래와 같다.

```text
대시보드처럼 한눈에 보고,
리서치 노트처럼 깊게 읽고,
가설 실험실처럼 예측과 실제를 비교하며,
매주 더 나은 질문으로 발전하는 리포트를 만든다.
```

## 2. 고정 원칙

### 2-1. 명칭 원칙

프로젝트 내부 문서, 시트, 리포트, 프롬프트, 코드에는 특정 외부 인물/브랜드명을 직접 언급하지 않는다.

사용할 표현:

```text
SSMK
SSMK score
SSMK 렌즈
SSMK 관찰 관점
SSMK Weekly Lab
```

금지:

```text
외부 인물/브랜드 직접 언급
외부 저작물 문체 모방
```

### 2-2. 비용 원칙

추가 API 과금 방식은 사용하지 않는다.

```text
외부 AI API 기반 유료 호출 방식 사용 금지
추가 과금 발생 가능성이 있는 자동 생성 방식 사용 금지
Codex/ChatGPT 구독 기반 예약 프롬프트 자동화 중심으로 운영
```

### 2-3. 발행 원칙

```text
리포트 자동 생성은 가능
이메일 자동 발송은 기본 OFF
외부 발송은 사용자 승인 후에만 진행
점수 모델, 데이터 출처, 자동화 단계 변경은 사용자 승인 후 적용
```

## 3. 리포트 정체성

리포트의 이름과 구조는 아래를 기준으로 한다.

```text
SSMK Weekly Lab
시장 지도 → 종목 해부 → 가설 실험실 → 복기와 진화
```

리포트는 아래 세 층으로 구성된다.

```text
앞부분:
시장, 산업, 종목 흐름을 한눈에 보는 대시보드

중간:
SSMK score와 SSMK 렌즈를 통한 종목/산업 해부

뒷부분:
핵심 가설 5개, 예측 조건, 실제 복기, 가설 발전 로그
```

## 4. 리포트 전체 목차

### 4-1. Executive Dashboard

목적:

이번 주 시장의 큰 그림을 한눈에 보여준다.

시각화:

- 시장 온도계 게이지
- 산업/테마 히트맵
- SSMK Top 5 스코어 보드

포함 데이터:

- 주요 ETF/지수 흐름
- VIX, 금리, 달러 흐름
- 섹터/테마별 평균 SSMK score
- 데이터 신뢰도와 불확실성

### 4-2. Market Map

목적:

시장 전체가 성장주, 배당주, 에너지, 방어주 중 어디에 더 무게를 두고 있는지 보여준다.

시각화:

- SPY / QQQ / SCHD / XLK / XLE 4주 선그래프
- 성장주 ETF vs 배당주 ETF 상대 성과
- 금리 변화와 성장주 점수 변화 미니 차트

### 4-3. Industry & Theme Board

목적:

산업과 테마를 분리해서 관찰한다.

시각화:

- 산업별 평균 SSMK score 막대그래프
- 테마별 4주 점수 변화 선그래프
- 산업/테마 히트맵

### 4-4. SSMK Stock Dashboard

목적:

종합점수만 보여주지 않고, 점수가 왜 그렇게 나왔는지 분해한다.

시각화:

- 종목별 SSMK score stacked bar
- 6개 점수 항목 분해 그래프
- 지난주 대비 점수 변화 waterfall chart

필수 해석:

```text
이 점수는 어떤 요인 때문에 만들어졌는가?
지난주와 비교해 어떤 항목이 점수를 올렸는가?
어떤 항목이 점수를 깎았는가?
점수 변화가 기업 본질 변화인지, 가격/뉴스 착시인지?
```

### 4-5. SSMK Lens Deep Dive

목적:

각 종목을 SSMK 렌즈 8개로 해부한다.

SSMK 렌즈:

```text
1. 돈을 어디서 버는가
2. 그 돈벌이가 커지는 시장 안에 있는가
3. 매출이 이익으로 남는가
4. 현금이 실제로 들어오는가
5. 주주에게 돌려주는가
6. 내부자는 어떤 행동을 하는가
7. 가격은 기대를 얼마나 반영했는가
8. ETF/산업 흐름과 같은 방향인가
```

시각화:

- 매출 구성 donut chart
- 마진 추이 line chart
- FCF bar chart
- 배당 안정성 gauge
- 내부자 거래 timeline
- ETF 편입 비중 비교표

표현 규칙:

```text
MSFT(마이크로소프트)
DIS(디즈니)
AAPL(애플)
NVDA(엔비디아)
```

티커만 쓰지 않고 일반 명칭을 괄호로 병기한다.

### 4-6. Hypothesis Lab

목적:

이번 주 핵심 가설 5개를 만들고, 예측 조건과 복기 조건을 명확히 남긴다.

가설 5개 역할:

```text
가설 1. 성장주/빅테크
가설 2. 산업/테마
가설 3. 배당주/방어주
가설 4. ETF/시장 흐름
가설 5. 리스크/턴어라운드
```

각 가설 필수 구조:

```text
가설 ID
가설 버전
한 줄 예측
근거 지표/데이터
출처
해석
레드팀 반박
보완된 최종 가설
예측 조건
복기 조건
초보자 레슨
용어 주석
```

예측 문장 기준:

```text
이 가설에 따르면,
OO 지표가 OO 수준을 유지하고,
OO 지표의 감소 추이가 멈춘다면,
다음 4주 동안 OO 흐름이 유지될 가능성을 관찰할 수 있다.
```

단, 투자 행동을 유도하지 않는다.

### 4-7. Forecast vs Actual

목적:

가설이 실제 데이터와 얼마나 맞았는지 비교한다.

시각화:

- 예측값 vs 실제값 bar chart
- 가설별 판정표
- 가설 신뢰도 변화 line chart

판정:

```text
적중
부분 적중
빗나감
아직 모름
```

핵심은 맞혔다는 자랑이 아니라, 다음 가설을 어떻게 조정할지다.

### 4-8. Dividend & ETF Corner

목적:

배당주와 ETF를 독립 코너로 다룬다.

시각화:

- 배당수익률 vs 배당성향 matrix
- 배당 성장률 5년 추이
- SCHD / VOO / QQQ / XLK / XLE 비교표
- ETF 상위 보유 종목 concentration chart

필수 질문:

```text
배당률 상승이 배당 증가 때문인가, 주가 하락 때문인가?
FCF가 배당을 뒷받침하는가?
배당성향이 과도하지 않은가?
ETF 상위 종목 쏠림이 심하지 않은가?
```

### 4-9. Hypothesis Evolution Log

목적:

가설이 v1 → v2 → v3로 어떻게 발전했는지 보여준다.

시각화:

- 가설 버전 timeline
- 추가된 조건
- 제거된 조건
- 다음 확인 지표

예:

```text
v1:
클라우드 성장률과 데이터센터 매출이 유지되면 AI 인프라 수요는 강하다고 본다.

복기:
매출은 강했지만 CapEx 증가로 마진 부담이 생겼다.

v2:
매출 성장 + 영업이익률 + CapEx 효율을 함께 본다.
```

### 4-10. Learning Notes

목적:

사용자가 이번 주에 무엇을 배웠는지 정리한다.

구성:

```text
오늘의 핵심 개념
오늘의 지표
오늘의 착각
다음 주 확인 질문
```

## 5. 용어 설명 규칙

어려운 용어는 본문에서 괄호로 풀고, 하단 주석으로 다시 설명한다.

본문 예:

```text
FCF(자유현금흐름: 회사가 비용과 투자를 빼고 실제로 남긴 현금)
CapEx(설비투자: 미래 성장을 위해 미리 쓰는 돈)
PER(주가수익비율: 주가가 이익의 몇 배인지 보는 지표)
```

하단 주석 예:

```text
주석. 배당성향
회사가 번 순이익 중 얼마를 배당으로 쓰는지 보는 비율입니다.
예를 들어 100원을 벌어 70원을 배당하면 배당성향은 70%입니다.
너무 높으면 배당이 유지되기 어려울 수 있습니다.
```

## 6. 출처 투명성

모든 핵심 숫자에는 출처와 신뢰도를 함께 표시한다.

예:

```text
Azure 성장률: 24%
출처: Microsoft FY2026 Q3 Earnings Release / Investor Relations
출처 등급: 공식 원자료
데이터 신뢰도: 높음
업데이트 기준일: 2026-04-21
```

출처 등급:

| 등급 | 의미 | 예시 |
|---|---|---|
| 공식 원자료 | 가장 우선 사용 | SEC 10-K/10-Q/Form 4, 기업 IR, ETF 운용사 페이지 |
| 공식 보조자료 | 공식이지만 해석 필요 | FRED, BLS, BEA, Federal Reserve |
| 보조 데이터 | 빠른 확인용 | StockAnalysis, Nasdaq dividend page, Yahoo Finance |
| 뉴스/해설 | 분위기와 이벤트 확인용 | Reuters, CNBC, WSJ, 기업 관련 뉴스 |
| AI 추정 | 출처 부족 시 임시 | 반드시 낮은 신뢰도와 한계 표시 |

## 7. Google Sheets 구조

Google Sheets는 네 층으로 나눈다.

```text
1. 설정층
2. 원천 데이터층
3. 분석 데이터층
4. 출력/자동화층
```

### 7-1. 설정층

추가/유지 탭:

```text
settings
user_preferences
source_policy
automation_schedules
```

`user_preferences` 예시 컬럼:

```text
setting_key
setting_value
setting_type
description
allowed_values
user_editable
```

`automation_schedules` 예시 컬럼:

```text
schedule_key
description
enabled
cadence
last_run_at
next_run_hint
```

초기 스위치:

| schedule_key | 설명 | 초기 상태 |
|---|---|---|
| monday_data_check | 월요일 데이터 상태 점검 | OFF |
| tuesday_weekly_report | 화요일 Weekly Lab 자동 생성 | ON |
| wednesday_revision_review | 수요일 재작업 요청 반영 | OFF |
| monthly_hypothesis_review | 월말 가설 복기 | OFF |

구조는 모두 구현하되, 초기에는 화요일 자동 생성만 켠다.

### 7-2. 원천 데이터층

추가 탭:

```text
market_data
company_fundamentals
revenue_breakdown
shareholder_returns
insider_activity
etf_watch
```

### 7-3. 분석 데이터층

추가/확장 탭:

```text
weekly_scores
sector_theme_scores
hypothesis_lab
hypothesis_reviews
hypothesis_evolution_log
```

`hypothesis_lab` 예시 컬럼:

```text
hypothesis_id
hypothesis_version
issue_date
hypothesis_type
related_tickers
related_industry
one_line_forecast
evidence_metrics
source_summary
interpretation
red_team_challenge
revised_hypothesis
forecast_condition
review_condition
beginner_lesson
confidence_level
status
```

### 7-4. 출력/자동화층

추가/확장 탭:

```text
visualization_queue
report_runs
report_sections
report_versions
revision_requests
agent_review_log
automation_run_log
automation_step_log
bottleneck_log
error_log
qa_review_log
glossary
```

## 8. 설정 화면

Apps Script 사이드바 이름:

```text
SSMK Control Center
```

기능:

```text
1. 리포트 기본 설정
2. 포함 섹션 설정
3. 자동화 스케줄 설정
4. 재작업 요청
5. 데이터 출처 정책 확인
6. 에이전트/QA 로그 확인
```

기본 설정:

```text
리포트 깊이: 대시보드 + 해설형
핵심 가설: 5개
리뷰 반복: 3회
최종 결과물: Google Docs 초안
이메일 자동 발송: OFF
```

재작업 요청 UI:

```text
어느 리포트를 고칠까요?
어느 부분을 고칠까요?
어떤 방향으로 고칠까요?
추가 요청사항은 무엇인가요?
```

재작업 요청 유형:

```text
make_easier
add_more_data
add_visuals
make_more_human
strengthen_forecast
soften_recommendation_risk
fix_source
rewrite_with_red_team
```

## 9. 에이전트 조직

공식 에이전트:

```text
루미: 리포트 작성과 쉬운 설명
벡터: 숫자와 출처 검증
세이지: 문장 품질과 추천화 위험 검토
파일럿: 복기 예약, 승인 상태, 버전 관리
노바: 가설 발전과 자동화 개선 제안
레드팀: 반대 가설, 약점, 놓친 리스크 공격
오퍼레이터: 전체 공정, 로그, 병목, QA 관리
```

리뷰 루프:

```text
루미 초안 작성
→ 벡터 데이터/출처 검증
→ 레드팀 반대 가설 제시
→ 루미 보완
→ 세이지 문장 품질 검토
→ 파일럿 복기/버전 확인
→ 노바 가설 발전 제안
→ 오퍼레이터 전체 공정 QA
→ block 있으면 해당 섹션 재작성
→ 최대 3회 반복
```

## 10. 로그/QA 구조

모든 자동화 실행은 `run_id`를 기준으로 기록한다.

### 10-1. automation_run_log

전체 실행 기록.

```text
run_id
run_type
started_at
ended_at
status
trigger_source
schedule_key
report_id
total_duration_sec
final_output_url
error_summary
notes
```

### 10-2. automation_step_log

단계별 기록.

```text
run_id
step_order
step_name
agent_name
started_at
ended_at
duration_sec
status
input_summary
output_summary
error_message
retry_count
```

### 10-3. bottleneck_log

병목과 비효율 기록.

```text
detected_at
run_id
bottleneck_type
location
symptom
impact
suggested_fix
priority
status
```

### 10-4. error_log

오류 기록.

```text
error_id
occurred_at
run_id
step_name
severity
error_type
error_message
root_cause_guess
recovery_action
resolved
resolved_at
```

### 10-5. qa_review_log

오퍼레이터 최종 공정 평가.

```text
qa_id
run_id
review_date
overall_status
content_quality_score
data_quality_score
visualization_quality_score
process_efficiency_score
main_issues
recommended_next_action
automation_change_needed
```

## 11. 자동화 운영 구조

추가 API 과금 방식은 사용하지 않는다.

역할 분담:

```text
Google Sheets:
데이터 저장소, 설정, 상태판

Google Apps Script:
시트 구조 정리, 설정 UI, 차트 큐/재작업 요청 관리

Codex 예약 자동화:
AI 리포트 작성, 에이전트 리뷰, 재작성 루프, Google Docs 생성

Google Docs:
최종 리포트 결과물
```

스케줄:

```text
월요일 밤: 데이터 상태 점검 구조 구현, 초기 OFF
화요일 오전: Weekly Lab 자동 생성 구조 구현, 초기 ON
수요일 오전: 사용자 확인/재작업 요청 반영 구조 구현, 초기 OFF
월말: 가설 복기와 발전 로그 구조 구현, 초기 OFF
```

## 12. 완료 기준

이 설계가 구현되면 아래 조건을 만족해야 한다.

- 사용자는 시트 열을 직접 만들지 않아도 된다.
- 사용자는 SSMK Control Center에서 설정을 바꿀 수 있다.
- 리포트는 대시보드 + 해설형 구조로 생성된다.
- 핵심 가설 5개가 생성되고 예측/복기 조건이 남는다.
- 가설은 v1/v2/v3로 발전 로그를 남긴다.
- 모든 핵심 숫자에는 출처와 신뢰도가 붙는다.
- 시각화 큐가 리포트 섹션과 연결된다.
- 재작업 요청은 섹션별/전체 범위로 저장된다.
- 모든 자동화 실행은 run/step/error/bottleneck/QA 로그를 남긴다.
- 오퍼레이터가 공정 품질과 병목을 평가한다.
- 이메일 발송과 중요한 자동화 변경은 사용자 승인 후에만 진행된다.
- 프로젝트 산출물에는 외부 인물/브랜드 직접 언급이 남지 않는다.

## 13. 구현 단계

### Phase 1. 구조 반영

- 새 Google Sheets 탭 생성
- 기존 탭 확장
- source_policy, user_preferences, automation_schedules 기본값 입력
- 로그 탭 생성
- 민감 명칭 금지 규칙 문서화

### Phase 2. 설정 화면

- `automation/SettingsSidebar.html` 작성
- `showSettingsSidebar()`
- `getUserPreferences()`
- `saveUserPreferences()`
- `saveRevisionRequest()`

### Phase 3. 리포트 템플릿 개편

- `templates/weekly-report-template.md`를 SSMK Weekly Lab 구조로 개편
- chart placeholder와 source note 규칙 추가
- Hypothesis Lab 5개 가설 구조 추가
- Forecast vs Actual, Hypothesis Evolution Log 추가

### Phase 4. 자동화 오케스트레이션

- `runWeeklyLabWorkflow()` 설계
- 로그 기록 함수 추가
- visualization_queue 생성 함수 추가
- report_sections/report_versions 업데이트 함수 추가
- 재작업 요청 처리 흐름 추가

### Phase 5. Codex 예약 자동화

- 화요일 Weekly Lab 자동 생성 heartbeat/cron 자동화 생성
- 나머지 스케줄은 구조만 만들고 OFF 유지
- 1회 샘플 실행 후 QA 로그 검토
