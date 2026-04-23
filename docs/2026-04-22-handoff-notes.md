# SSMK 투자 관찰노트 후속 작업 인수인계 기록

작성일: 2026-04-22

## 1. 오늘까지의 진행 요약

SSMK 투자 관찰노트 프로젝트의 초기 방향과 작업공간을 만들었다.

이 프로젝트는 특정 종목을 바로 추천하는 콘텐츠가 아니다. 좋은 기업과 좋은 산업을 매주 같은 기준으로 관찰하고, 점수와 근거를 기록하면서 투자 판단력을 기르기 위한 장기 학습형 리서치 프로젝트다.

오늘까지 완료한 핵심 작업은 다음과 같다.

1. 로컬 프로젝트 폴더 생성
2. 프로젝트 철학과 설계 기록 작성
3. Google Drive 폴더 확인
4. Google Sheets 점수표 생성
5. Google Sheets 기본 탭 구성
6. 초기 이메일 수신자 등록
7. 초기 워치리스트 20개 선정 및 입력
8. Notion 프로젝트 허브 업데이트
9. README에 주요 링크와 워치리스트 추가
10. 초기 작업공간 세팅 기록 작성
11. 주간 리포트, 종목 카드, 산업 카드, 월간 리뷰 템플릿 작성
12. 1회차 샘플 주간 리포트 작성
13. 산업 구분을 7개 핵심 산업 + 테마 태그 + 투자 성격 방식으로 정리
14. 10점 점수 + 관찰 등급 + 데이터 신뢰도 하이브리드 표현 방식 도입
15. AI 보조 학습형 관찰 아키텍처 문서 작성
16. SSMK 점수 모델 v1 문서 작성
17. 샘플 점수표 CSV 작성
18. 주간 템플릿과 샘플 리포트에 AI 가설 구조 반영
19. 종목 카드, 산업 카드, 월간 리뷰 템플릿에 AI 가설/복기 구조 반영
20. Google Sheets 구조 업데이트 계획 문서 작성
21. AI 자동 리포트 생성 흐름 문서 작성
22. 가설 복기용 샘플 CSV 작성
23. 주간 리포트 생성용 AI 프롬프트 작성
24. 가설 복기용 AI 프롬프트 작성
25. Google Apps Script 설계 계획 작성
26. 자동화 발전 승인 게이트 문서 작성
27. 자동화 발전 리뷰/변경 승인 로그 샘플 CSV 작성
28. AI 에이전트 역할 분리와 리뷰 보드 설계 작성
29. 에이전트 리뷰 로그 샘플 CSV 작성

## 2. 프로젝트 작업 위치

로컬 기준 작업 폴더:

```text
C:\Users\kblife\Documents\AI-Playground\SSMK-investment-journal
```

이후 모든 파일 작업은 이 폴더를 기준으로 진행한다.

## 3. 현재 로컬 폴더 구조

```text
SSMK-investment-journal/
├─ README.md
├─ automation/
│  ├─ google-sheets-structure-plan.md
│  ├─ ai-report-generation-workflow.md
│  ├─ ai-prompt-weekly-report.md
│  ├─ ai-prompt-hypothesis-review.md
│  ├─ ai-agent-roles-and-review-board.md
│  ├─ automation-evolution-approval-gate.md
│  └─ google-apps-script-plan.md
├─ data/
│  ├─ sample-score-table.csv
│  ├─ sample-hypothesis-review-table.csv
│  ├─ sample-automation-stage-review-table.csv
│  ├─ sample-change-approval-log.csv
│  └─ sample-agent-review-log.csv
├─ docs/
│  ├─ 2026-04-22-project-philosophy-and-design.md
│  ├─ 2026-04-22-initial-workspace-setup.md
│  ├─ 2026-04-22-automation-readiness-and-roadmap.md
│  ├─ ai-assisted-learning-architecture.md
│  ├─ score-model-v1.md
│  └─ 2026-04-22-handoff-notes.md
├─ reports/
│  └─ sample-weekly-report-001.md
└─ templates/
```

각 폴더의 역할:

- `docs`: 설계 기록, 철학, 작업 인수인계, 의사결정 문서
- `templates`: 주간 리포트, 종목 카드, 산업 카드, 월간 리뷰 템플릿
- `reports`: 실제 생성된 주간 리포트와 월간 리뷰
- `data`: 샘플 CSV, 점수표 백업, 데이터 스냅샷
- `automation`: Google Apps Script, Python, 자동화 설계와 스크립트

## 4. 주요 외부 작업공간

### Google Drive 폴더

사용자가 만든 Drive 폴더:

```text
G:\내 드라이브\[AI Project]\SSMK-investment-journal
```

Google Drive URL:

```text
https://drive.google.com/drive/folders/1ST6ZO7HswMPBt9n6aiQ3qP4gA_KF7eaB
```

주의:

현재 로컬 터미널에서는 `G:` 드라이브가 연결되어 있지 않아 직접 접근할 수 없었다. Google Drive 커넥터에서는 폴더를 확인했다.

### Google Sheets 점수표

파일명:

```text
SSMK 투자 관찰노트 - 점수표
```

URL:

```text
https://docs.google.com/spreadsheets/d/121yVeU20KkZ2szGFGPNq7H8KdLSgDgLy5y0naGzRFsA/edit
```

주의:

Google Drive 커넥터의 현재 파일 생성 기능은 특정 폴더 안에 바로 생성하거나 기존 파일을 특정 폴더로 이동하는 기능이 노출되어 있지 않았다. 그래서 시트는 기본 Drive 위치에 생성되었다. 필요하면 사용자가 Google Drive 화면에서 직접 아래 위치로 이동해야 한다.

```text
내 드라이브 → [AI Project] → SSMK-investment-journal
```

이동 방법:

```text
Google Drive에서 "SSMK 투자 관찰노트 - 점수표" 검색
→ 오른쪽 클릭
→ 이동
→ 내 드라이브
→ [AI Project]
→ SSMK-investment-journal
→ 이동
```

### Notion 프로젝트 허브

워크스페이스:

```text
song's cave
```

페이지:

```text
SSMK-investment-journal
```

URL:

```text
https://www.notion.so/34163ad6fcc6808fbc5ac2e8b5721979
```

현재 Notion 페이지에는 프로젝트 개요, 핵심 원칙, Google Sheets 링크, 로컬 폴더 경로, Drive 폴더 경로, 초기 워치리스트, 다음 작업, 주의 문구가 들어가 있다.

## 5. Google Sheets 현재 탭 구조

현재 생성된 탭:

```text
settings
watchlist
weekly_scores
score_history
industry_notes
report_queue
recipients
news_events
data_sources
```

주의:

아래 컬럼 구조는 로컬 문서 기준으로 업데이트한 권장안이다. 실제 Google Sheets 파일에 이미 생성된 기존 컬럼과 다를 수 있으므로, 다음 단계에서 `docs/score-model-v1.md`와 `data/sample-score-table.csv` 기준으로 Google Sheets 컬럼을 최종 반영해야 한다.

### settings

프로젝트 기본 설정을 저장한다.

현재 값:

```text
project_name = SSMK 투자 관찰노트
issue_day = Wednesday
timezone = Asia/Seoul
score_max = 10
top_n = 3
publish_mode = draft_then_manual_approval
disclaimer = 투자 권유가 아닌 투자 공부용 관찰 기록입니다.
```

### watchlist

초기 관찰 종목 20개가 들어 있다.

권장 컬럼:

```text
ticker
company
core_industry
theme_tags
investment_style
role_in_watchlist
tracking_priority
dividend_focus
business_model_focus
key_metrics_to_watch
main_events_to_watch
active
notes
```

### weekly_scores

매주 SSMK 점수를 입력하거나 자동 계산할 탭이다.

권장 주요 컬럼:

```text
week_start
issue_date
ticker
company
core_industry
theme_tags
core_score
shareholder_return_score
industry_score
business_model_score
valuation_timing_score
insider_event_score
ssmk_total_score
observation_grade
previous_score
score_change
signal
risk_flag
data_confidence
uncertainty_level
reason_summary
hypothesis_summary
evidence_metrics
reasoning_explanation
beginner_lesson
limitations
next_check
source_links
review_status
```

운영 원칙:

```text
hypothesis_summary = AI가 세운 학습용 가설의 한 줄 요약
evidence_metrics = 그 가설을 만든 근거 지표와 데이터
reasoning_explanation = 그 지표를 보고 왜 그런 예상이 나왔는지에 대한 설명
beginner_lesson = 초보자가 이 지표에서 배울 포인트
limitations = 현재 데이터와 추론의 한계
next_check = 다음 주 또는 다음 실적에서 확인할 항목
```

### score_history

매주 확정된 점수를 누적 저장할 탭이다. 나중에 그래프와 월간 리뷰의 기준 데이터가 된다.

### industry_notes

핵심 산업별로 봐야 할 핵심 지표와 이벤트가 들어 있다.

현재 산업:

- AI/클라우드/반도체 인프라
- 디지털 플랫폼/광고
- 미디어/게임/콘텐츠
- 자동차/전기차
- 헬스케어/제약
- 에너지/산업소재
- 글로벌 소비재/럭셔리

운영 메모:

- 월간 리뷰는 위 7개 핵심 산업으로 묶는다.
- 종목 카드에는 `테마 태그`와 `투자 성격`을 별도로 기록한다.
- 예를 들어 MSFT는 핵심 산업을 `AI/클라우드/반도체 인프라`로 두고, 테마 태그에는 `AI`, `클라우드`, `게임`, `주주환원`을 함께 적는다.

### report_queue

주간 리포트에 들어갈 후보 항목을 관리할 탭이다.

예상 섹션:

- 이번 주 3줄 요약
- 이번 주 산업 관찰 우선순위 3개
- SSMK 관찰 우선순위 3개
- 점수 변화 확인 후보 3개
- 이번 주 AI 가설 3개
- AI의 솔직한 한계
- 밸류에이션 재점검 후보 3개
- 리스크 먼저 확인할 후보 3개
- 지난 가설과 실제 결과 비교
- 종목 딥다이브
- 이번 주 레슨&런

### recipients

이메일 수신자를 관리한다.

현재 등록된 수신자:

```text
상민 / iamsangmin@naver.com / TRUE / 초기 테스트 수신자
```

### news_events

종목/핵심 산업/테마별 뉴스, 이벤트, 리스크, 실적 발표 등을 기록할 탭이다.

### data_sources

주요 데이터 출처를 기록한다.

현재 포함된 출처:

- SEC EDGAR
- Nasdaq Dividend History
- 한경 컨센서스
- StockAnalysis
- Google News

## 6. 초기 워치리스트 20개

이 목록은 매수 추천이 아니다. 산업별 흐름과 기업 지표를 공부하기 위한 관찰 후보로 선정했다.

| 핵심 산업 | 종목 | 대표 테마 태그 | 대표 투자 성격 |
|---|---|---|---|
| AI/클라우드/반도체 인프라 | MSFT, NVDA, QCOM, AAPL | AI, 클라우드, 반도체, 온디바이스 AI | 성장주, 혼합 |
| 디지털 플랫폼/광고 | GOOGL, META, TTD | 광고, 플랫폼, AI 광고 도구 | 성장주, 플랫폼 |
| 미디어/게임/콘텐츠 | NFLX, DIS, TTWO | 스트리밍, 콘텐츠, 게임, 턴어라운드 | 성장주, 턴어라운드 |
| 자동차/전기차 | TSLA, GM | 전기차, 자율주행, 가격 경쟁 | 성장주, 경기민감, 턴어라운드 |
| 헬스케어/제약 | JNJ, LLY, MRK | 신약, 파이프라인, 방어주, 배당 | 방어주, 배당주, 성장주 |
| 에너지/산업소재 | XOM, CVX, LIN | 유가, 현금흐름, 산업용 가스, 배당 | 배당주, 경기민감 |
| 글로벌 소비재/럭셔리 | EL, LVMUY | 중국 소비, 브랜드 파워, 럭셔리, 마진 | 소비재, 턴어라운드 |

선정 기준:

- 핵심 산업별 대표성이 있다.
- 미국 시장에서 데이터 접근이 비교적 쉽다.
- 실적, 공시, 뉴스, 이벤트를 꾸준히 추적할 가치가 있다.
- 성장주와 배당주가 섞여 있다.
- 초보자가 산업별 차이와 테마별 흐름을 함께 배우기에 좋다.

주의:

`LVMUY`는 LVMH ADR/OTC 종목이라 일부 데이터 자동화가 다른 미국 대형 상장주보다 어려울 수 있다. 나중에 데이터 수집 자동화 단계에서 문제가 생기면 `EL`, `COTY`, `TPR`, `RL` 등으로 대체 후보를 검토할 수 있다.

## 7. 현재 설계 철학

SSMK 투자 관찰노트는 다음 철학을 유지해야 한다.

```text
좋은 투자는 좋은 종목을 맞히는 게임이 아니라,
좋은 질문을 반복해서 던지는 습관이다.
```

매주 반복할 핵심 질문:

- 이 회사는 무엇으로 돈을 버는가?
- 그 돈벌이는 앞으로 커질 산업 안에 있는가?
- 경쟁사보다 강한 이유가 있는가?
- 매출, 이익, EPS, 현금흐름은 함께 좋아지고 있는가?
- 배당과 자사주 매입은 지속 가능한가?
- 내부자는 이 회사를 사고 있는가?
- 지금 가격은 기다릴 구간인가, 관심을 가질 구간인가?
- 이번 주 점수 변화는 기업의 본질 변화인가, 단기 주가 변동 때문인가?
- AI가 세운 가설은 어떤 지표를 근거로 했고, 그 지표는 무엇을 보여주는가?
- 지난 가설은 실제 시장, 실적, 뉴스 흐름과 얼마나 비슷하게 움직였는가?

## 8. SSMK 점수 체계 현재 설계안

현재 권장 점수 구조:

```text
SSMK Index =
기업 체력 점수
+ 배당/주주환원 점수
+ 산업 매력도 점수
+ 비즈니스 모델 점수
+ 가격/타이밍 점수
+ 내부자/이벤트 점수
```

권장 비중:

| 구분 | 비중 | 의미 |
|---|---:|---|
| 기업 체력 점수 | 30% | 매출, 이익, EPS, 현금흐름, 부채 |
| 배당/주주환원 점수 | 20% | 배당성향, 배당성장, 자사주매입 |
| 산업 매력도 점수 | 20% | 산업 성장률, 침투율, 마켓쉐어, 구조적 트렌드 |
| 비즈니스 모델 점수 | 15% | 레비뉴 브레이크다운, 반복매출, 수익원 안정성 |
| 가격/타이밍 점수 | 10% | 밸류에이션, 역사적 배당률, 주가 위치 |
| 내부자/이벤트 점수 | 5% | 내부자 매수, 실적발표, 제품출시, 규제 이벤트 |

중요:

점수는 매수 추천 신호가 아니다. 점수는 관찰 우선순위를 정하기 위한 도구다. 숫자 점수는 유지하되, 앞으로는 `관찰 등급`과 `데이터 신뢰도`를 함께 표시한다.
여기에 `불확실성`을 함께 기록해서, 점수가 높더라도 데이터가 약하거나 추론이 흔들릴 수 있는 경우를 분리해서 본다.

| SSMK 점수 | 관찰 등급 | 의미 |
|---:|---|---|
| 8.0~10.0 | 높음 | 이번 주에 먼저 공부할 이유가 큼 |
| 6.0~7.9 | 중간 | 계속 지켜보며 변화 이유 확인 |
| 0.0~5.9 | 낮음 | 우선순위는 낮지만 리스크/회복 가능성은 기록 |

데이터 신뢰도 기준:

| 신뢰도 | 예시 |
|---|---|
| 높음 | SEC 공시, 기업 IR, 공식 배당 발표처럼 원자료가 확인된 경우 |
| 중간 | 공식 자료 1개와 뉴스/데이터 사이트가 함께 확인된 경우 |
| 낮음 | 단일 뉴스, 추정치, 자동 수집 오류 가능성이 있는 경우 |

## 9. 권장 콘텐츠 구조

SSMK Weekly Insight의 기본 구조:

```text
1. 이번 주 3줄 요약
2. 시장 온도계
3. 이번 주 산업 관찰 우선순위 3개
4. SSMK 관찰 우선순위 3개
5. 점수 변화 확인 후보 3개
6. 이번 주 AI 가설 3개
7. AI의 솔직한 한계
8. 밸류에이션 재점검 후보 3개
9. 리스크 먼저 확인할 후보 3개
10. 지난 가설과 실제 결과 비교
11. 장기 추적 종목 그래프
12. 종목 딥다이브 1개
13. 이번 주 레슨&런
14. 다음 주 체크 이벤트
15. 데이터 출처와 면책 문구
```

후보 5개가 아니라 3개 후보를 사용한다. 이유는 정보량을 줄이고, 초보자가 핵심 변화에 집중하도록 하기 위해서다. 표현은 `관찰 우선순위 3개`, `재점검 후보 3개`처럼 투자 행동을 덜 유도하는 이름을 우선 사용한다.

## 10. 권장 자동화 아키텍처

초기 목표는 "AI 자동 분석/가설/초보자용 해석/리포트 초안 생성 + 사람 학습/질문/발송 승인"이다.

중요한 전제:

```text
사람은 투자 전문가로서 AI를 검수하는 사람이 아니다.
사람은 이 프로젝트의 첫 번째 학습자이자 편집장이다.
AI는 데이터를 모으고, 가설을 만들고, 왜 그런 가설을 세웠는지 초보자 눈높이로 설명한다.
사람은 이해되지 않는 부분을 질문하고, 외부 발송 여부를 승인한다.
```

```text
Google Sheets
  ↓
Google Apps Script 또는 Python 자동화
  ↓
주간 점수 계산 / 관찰 후보 3개 선정 / AI 가설 생성
  ↓
가설 요약 + 근거 지표 + 해석 이유 + 초보자 레슨 + 한계 작성
  ↓
Markdown 또는 Google Docs 초안 생성
  ↓
사람 학습 / 질문 / 발송 승인
  ↓
PDF 생성
  ↓
Gmail 발송
  ↓
Google Drive / Notion / 로컬 reports 폴더에 아카이브
```

초기 무료 운영 도구:

- Google Sheets: 중앙 점수표
- Google Apps Script: 월/화/수 자동 작업
- Gmail: 소수 가족/지인 대상 발송
- Google Drive: PDF 보관
- Notion: 리서치 허브
- 로컬 Markdown: 설계와 템플릿 관리

나중에 확장 가능한 도구:

- GitHub Actions
- Python 데이터 수집 스크립트
- GitHub Pages 정적 대시보드
- Windows 작업 스케줄러
- Hermes Agent 또는 cron 방식의 로컬 자동화

## 11. 권장 주간 운영 흐름

### 월요일: 데이터 수집

- 주가 데이터 수집
- 배당 데이터 확인
- 실적 일정 확인
- 주요 뉴스 수집
- 내부자 거래 확인
- 산업 리포트 후보 수집
- 산업 키워드 검색

### 화요일: 점수 계산과 초안 생성

- SSMK 점수 계산
- 지난주 점수와 비교
- 관찰 후보 3개 선정
- AI 가설 3개 생성
- 각 가설의 근거 지표와 해석 이유 작성
- 초보자가 배울 포인트와 현재 한계 작성
- 워치리스트 그래프 업데이트
- 종목 카드 초안 작성
- 산업 관찰 우선순위 초안 작성

### 수요일: 학습, 질문, 승인, 발행

- 최종 뉴스레터 생성
- PDF 생성
- Google Sheets 점수 확정
- 이해되지 않는 가설이나 지표를 AI에게 재질문
- Notion 아카이브 저장
- 이메일 발송 승인 후 발송
- 선택적으로 웹 대시보드 갱신

### 월간 리뷰

- 한 달간 점수 상승 복기 후보 3개
- 한 달간 점수 하락 복기 후보 3개
- 산업별 흐름
- 지난 판단 복기
- 지난 AI 가설과 실제 결과 비교
- 틀린 판단의 원인 정리
- 다음 달 관찰 포인트 설정

## 12. 이어서 해야 할 작업 목록과 순서

콘텐츠 템플릿, 1회차 샘플 리포트, 점수 모델 v1, 샘플 점수표 CSV, Google Sheets 구조 업데이트 계획, AI 자동 리포트 생성 흐름, 가설 복기용 샘플 CSV, AI 프롬프트 2개, AI 에이전트 리뷰 보드, Google Apps Script 설계 계획, 자동화 발전 승인 게이트는 작성 완료 상태다. 다음 작업은 실제 Google Sheets에 이 구조를 반영하고, `automation/Code.gs` 초안을 만드는 것이다.

### 1단계: 템플릿 작성

생성할 파일:

```text
templates/weekly-report-template.md
templates/company-card-template.md
templates/industry-card-template.md
templates/monthly-review-template.md
```

상태: 완료

목표:

- 매주 리포트의 고정 목차 확정
- 종목 카드 반복 구조 확정
- 산업 카드 반복 구조 확정
- 월간 리뷰 복기 구조 확정

### 2단계: 1회차 샘플 리포트 작성

생성할 파일:

```text
reports/sample-weekly-report-001.md
```

상태: 완료

목표:

- 실제로 읽기 쉬운지 확인
- 정보량이 너무 많지 않은지 확인
- 투자 추천처럼 오해되지 않는지 확인
- 모바일에서 읽기 쉬운 구조인지 확인

### 3단계: 점수 모델 상세화

생성할 파일:

```text
docs/score-model-v1.md
data/sample-score-table.csv
```

상태: 완료

목표:

- 각 점수 항목의 0~10점 기준 정의
- 10점 점수와 관찰 등급의 연결 규칙 정의
- 데이터 신뢰도 기준 정의
- 감점 규칙 정의
- 리스크 플래그 기준 정의
- 관찰 후보 3개 선정 기준 정의

### 4단계: Google Sheets 수식 설계

작업 대상:

```text
SSMK 투자 관찰노트 - 점수표
```

목표:

- weekly_scores 탭에서 총점 자동 계산
- previous_score와 score_change 계산
- signal 자동 분류
- risk_flag 입력 규칙 정리
- hypothesis_summary, evidence_metrics, reasoning_explanation, beginner_lesson, limitations, next_check 컬럼 추가
- 관찰 등급, 데이터 신뢰도, 불확실성 표시 규칙 반영

상태: 설계 문서 완료, 실제 Google Sheets 반영은 다음 작업

관련 파일:

```text
automation/google-sheets-structure-plan.md
data/sample-score-table.csv
data/sample-hypothesis-review-table.csv
```

### 5단계: Google Apps Script 설계

생성할 파일:

```text
automation/google-apps-script-plan.md
automation/Code.gs
```

목표:

- 월요일 데이터 수집 함수 설계
- 화요일 점수 계산/AI 가설 생성/초안 생성 함수 설계
- 수요일 승인 후 이메일 발송 함수 설계
- 월간 리뷰 생성 함수 설계

상태: AI 리포트 생성 흐름 문서와 Apps Script 설계 계획 완료, Apps Script 코드 초안은 다음 작업

관련 파일:

```text
automation/ai-report-generation-workflow.md
automation/ai-prompt-weekly-report.md
automation/ai-prompt-hypothesis-review.md
automation/ai-agent-roles-and-review-board.md
automation/google-apps-script-plan.md
automation/automation-evolution-approval-gate.md
```

자동화 발전 승인 원칙:

```text
AI는 콘텐츠 품질과 데이터 안정성을 자가검증한다.
다음 단계로 넘어가도 된다고 판단하면 제안서를 만든다.
제안서에는 현재 상태, 판단 근거, 추천 변경, 기대 효과, 위험과 한계, 되돌리는 방법이 포함되어야 한다.
사용자가 승인하기 전에는 자동화 수준, 점수 모델, 데이터 출처, 프롬프트 구조, 발송 범위를 변경하지 않는다.
```

초기에는 완전 자동 발송이 아니라 승인 발행으로 설계한다. 특히 처음 4주는 AI가 자동 초안을 만들고, 사용자는 첫 번째 학습자로서 가설의 근거와 설명이 이해되는지 확인한다.

### 5-1단계: 4주 AI 자동 초안 운영 테스트

목표:

- AI가 만든 가설, 근거, 해석 설명이 초보자에게 이해되는지 확인한다.
- 매주 필요한 데이터와 없어도 되는 데이터를 구분한다.
- 데이터 출처가 자주 깨지는 항목을 찾는다.
- 리포트가 추천처럼 읽히지 않는지 확인한다.
- 지난 가설과 실제 시장/실적/뉴스 흐름을 비교해 모델을 개선한다.

운영 방식:

1. 1주차: 5~7개 종목으로 AI 가설 구조가 읽히는지 확인한다.
2. 2주차: 10~12개 종목으로 늘리고, 점수와 관찰 등급, 데이터 신뢰도, 불확실성을 함께 본다.
3. 3주차: 데이터 신뢰도와 리스크 플래그, AI의 한계 설명을 반드시 입력한다.
4. 4주차: 반복되는 데이터 수집, 자주 틀리는 해석, 실제 결과와 어긋난 가설을 분류한다.

판단 기준:

```text
4주 동안 매주 반복했고, 출처가 안정적이며, 설명 구조가 초보자에게 도움이 되는 항목부터 자동화 강도를 높인다.
출처가 자주 바뀌거나 해석이 흔들리는 항목은 AI가 한계를 밝히고 다음 확인 항목으로 남긴다.
```

### 6단계: PDF/이메일 발행 테스트

목표:

- 본인 이메일 `iamsangmin@naver.com`으로 테스트 발송
- PDF 첨부 또는 Drive 링크 방식 비교
- 모바일 가독성 확인
- 면책 문구 포함 확인

### 7단계: 월간 리뷰 템플릿과 점수 복기

목표:

- 한 달간 점수 변화 그래프
- 점수 상승/하락 원인 요약
- 틀린 판단 복기
- 다음 달 모델 개선 사항 기록

## 13. 후속 작업 시 주의할 점

1. 투자 추천처럼 보이는 표현을 피한다.
   - 좋은 표현: "관찰 후보", "추가 확인 필요", "점수 상승 원인 확인"
   - 피할 표현: "매수 추천", "지금 사야 할 종목", "확실한 기회"

2. 점수보다 변화 이유를 더 중요하게 다룬다.
   - 8.5점이라는 숫자보다 왜 8.5점인지가 중요하다.

3. 고배당 함정을 반드시 경계한다.
   - 배당률 상승이 좋은 신호인지, 주가 급락에 따른 착시인지 구분해야 한다.

4. 산업과 기업을 함께 본다.
   - 기업 점수가 좋아도 산업이 구조적으로 나빠지면 리스크가 커질 수 있다.

5. 자동 발송은 승인 후에만 한다.
   - AI가 가설과 해석 초안을 만들고 복기까지 돕되, 외부 이메일 발송 전에는 사람의 학습/질문/승인 단계를 유지한다.

6. 자동화 발전도 승인 후에만 적용한다.
   - AI가 다음 단계로 넘어가도 좋겠다고 판단하면 반드시 근거와 위험, 되돌림 방법을 설명하고 사용자 승인을 요청한다.

7. 가설은 초보자에게 지표의 의미를 가르쳐야 한다.
   - 좋은 구조: 가설 요약 + 근거 지표/데이터 + 왜 그렇게 해석했는지 + 초보자 레슨 + 한계와 다음 확인
   - 피할 구조: "데이터가 좋아 보여서 상승 가능성이 있습니다"처럼 근거와 해석 과정이 비어 있는 문장

8. 가족과 지인에게 공유할 때 면책 문구를 넣는다.
   - 모든 리포트에 "투자 권유가 아닌 투자 공부용 관찰 기록"임을 명시한다.

## 14. 후속 작업 요청용 짧은 프롬프트

다음에 작업을 이어갈 때 아래 프롬프트를 사용하면 된다.

```text
SSMK 투자 관찰노트 프로젝트를 이어서 진행해줘. 작업 폴더는 `C:\Users\kblife\Documents\AI-Playground\SSMK-investment-journal`이고, 먼저 README, `docs/2026-04-22-handoff-notes.md`, `docs/ai-assisted-learning-architecture.md`, `docs/score-model-v1.md`, `docs/2026-04-22-automation-readiness-and-roadmap.md`, `automation/google-sheets-structure-plan.md`, `automation/ai-report-generation-workflow.md`, `automation/ai-agent-roles-and-review-board.md`, `automation/google-apps-script-plan.md`, `automation/automation-evolution-approval-gate.md`를 읽고 현재 진행상황을 파악해줘. 템플릿 4개, `reports/sample-weekly-report-001.md`, `docs/score-model-v1.md`, `data/sample-score-table.csv`, `data/sample-hypothesis-review-table.csv`, `data/sample-agent-review-log.csv`, Google Sheets 구조 업데이트 계획, AI 자동 리포트 생성 흐름, AI 프롬프트 2개, AI 에이전트 리뷰 보드, Google Apps Script 설계 계획, 자동화 발전 승인 게이트는 작성 완료 상태야. 다음 후속 작업은 실제 Google Sheets 컬럼 반영과 `automation/Code.gs` 초안 작성이야. 모든 가설은 `가설 요약 + 근거 지표/데이터 + 왜 그렇게 해석했는지 + 초보자 레슨 + 한계와 다음 확인` 구조로 작성하고, 루미/벡터/세이지/파일럿/노바 에이전트 리뷰 보드로 콘텐츠와 데이터와 프로세스를 분리 검증하며, 자동화 발전이나 중요한 변경은 AI가 제안서를 만들고 사용자 승인을 받은 뒤에만 적용하고, 투자 추천이 아니라 투자 공부용 관찰 기록이라는 철학을 유지해줘.
```
