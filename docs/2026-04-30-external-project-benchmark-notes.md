# 외부 프로젝트 벤치마킹 노트: DartLab, Korean DART MCP, The Gongsi

작성일: 2026-04-30

이 문서는 SSMK Weekly Lab을 개선할 때 참고할 외부 프로젝트 3개의 구조와 벤치마킹 포인트를 정리한 기록이다. SSMK는 미국증시 중심 프로젝트이므로 DART 데이터 자체를 그대로 가져오는 것이 목적이 아니다. 핵심은 이 프로젝트들이 "공시/원자료를 어떻게 질문 가능한 분석 엔진으로 만들고, AI가 어떤 구조로 해석하게 하는가"를 배우는 것이다.

관련 기준 문서:

- `docs/SSMK-WEEKLY-LAB-SOUL.md`

검토 대상:

- DartLab: <https://github.com/eddmpython/dartlab>
- Korean DART MCP: <https://github.com/chrisryugj/korean-dart-mcp>
- The Gongsi: <https://github.com/kinkos1234/thegongsi>

## 1. 결론

세 프로젝트에서 SSMK가 배워야 할 핵심은 아래 5가지다.

1. 데이터 수집과 AI 해석을 한 덩어리로 섞지 않는다.
2. 원자료는 먼저 비교 가능한 사실 카드로 정규화한다.
3. 투자자가 자주 묻는 질문을 `signal preset`으로 만든다.
4. AI는 답을 찍는 조언자가 아니라 원자료를 읽고 검증하는 독해기 역할을 한다.
5. 최종 콘텐츠와 운영 로그, 품질 검증 결과는 화면과 문서에서 분리한다.

SSMK에 적용할 목표 구조:

```text
Source Layer
→ Fact Engine
→ Signal Preset
→ Story Builder
→ AI Explainer
→ QA Gate
→ Output Split
```

이 구조는 `원자료 -> 사실 카드 -> 해석 카드 -> 초보자 레슨 -> 최종 HTML`이라는 SSMK soul의 원칙과 연결된다.

## 2. DartLab 벤치마킹

프로젝트 요약:

DartLab은 종목코드 하나로 기업의 공시, 재무제표, 비율, 사업 설명, 기간별 변화 등을 한 인터페이스에서 읽고 비교하는 구조를 가진다. 한국 DART와 미국 SEC EDGAR를 함께 다루며, "숫자를 나열하면 대시보드가 되지만 숫자의 인과를 연결하면 스토리가 된다"는 관점이 강하다.

핵심 구조:

| 레이어 | 역할 | SSMK 적용 아이디어 |
|---|---|---|
| Company | 종목 하나를 중심으로 원자료와 재무 데이터를 통합 | `ticker_fact_profile` 또는 `report_fact_cards` 생성 |
| Analysis/Quant/Credit/Macro/Industry | 숫자와 근거를 만든다 | AI가 바로 문장을 쓰기 전에 계산/근거 레이어 분리 |
| Story | 엔진 결과를 보고서 블록으로 조합 | Docs/HTML 생성 전에 섹션별 story block 생성 |
| AI | 엔진을 직접 쓰고, 원본을 의심하고, 다시 계산 | QA Gate에서 "근거 없는 해석" 차단 |

SSMK에 가져올 것:

- `Company(code)`처럼 종목 하나를 불러오면 핵심 정보가 모이는 파사드 개념
- 기간별 비교 가능성: 이번 주, 1주 전, 4주 전, 직전 실적 기준을 같은 모양으로 맞추기
- 분석 엔진과 AI 해석 분리
- 숫자/근거만 만드는 레이어와, 초보자 설명을 만드는 레이어 분리
- `trace` 개념: 이 숫자가 어디서 왔는지 추적 가능한 출처 기록

SSMK에 바로 적용할 구체 항목:

```text
report_fact_cards
- issue_date
- ticker
- company
- price_change_1w
- price_change_4w
- score_now
- score_previous
- score_change
- key_news_candidates
- missing_data
- source_summary
- data_confidence
```

주의할 점:

DartLab은 도구/엔진 성격이 강하다. SSMK는 최종적으로 초보자 학습 콘텐츠를 만들어야 하므로, 엔진 구조를 가져오되 최종 문장은 더 쉬운 한국어 설명으로 바꿔야 한다.

## 3. Korean DART MCP 벤치마킹

프로젝트 요약:

Korean DART MCP는 OpenDART 83개 API를 15개 MCP 도구로 묶고, 내부자 시그널, 회계 리스크, 공시 검색 프리셋, XBRL 추출 같은 투자자 질문 중심 기능을 제공한다. 핵심은 "공시 API를 그대로 노출"하는 것이 아니라, 일반 투자자가 실제로 묻는 질문을 도구화했다는 점이다.

핵심 구조:

| 기능 | 의미 | SSMK 미국증시 버전 |
|---|---|---|
| insider_signal | 임원/대주주 매수·매도 클러스터 확인 | SEC Form 4 내부자 거래 |
| disclosure_anomaly | 정정공시, 감사, 자본 스트레스 등 회계 리스크 | 10-K/10-Q amendment, auditor change, going concern, impairment |
| search_disclosures preset | 자사주, 유상증자, CB, 합병 등 이벤트 검색 | buyback, offering, convertible notes, M&A, spin-off |
| get_xbrl markdown_full | XBRL 전체 계정과 계산 검증 | SEC XBRL us-gaap 계정 추출과 계산/출처 기록 |
| attachment extract | PDF/HWP를 마크다운화 | IR PDF, 10-K HTML, ETF factsheet 요약 |

SSMK에 가져올 것:

- `signal_presets` 개념
- 원자료 API 이름보다 사용자의 질문을 중심으로 도구를 설계하는 방식
- 리스크를 `clean/watch/warning/red_flag`처럼 운영자가 바로 이해할 수 있는 판정으로 바꾸는 방식
- "개별 evidence"를 남기는 구조
- 대량 공시나 이벤트를 자동 분할해서 수집하는 방식

SSMK에 만들 signal preset 후보:

| preset_key | 초보자 질문 | 미국증시 데이터 후보 | 보고서 반영 |
|---|---|---|---|
| `dividend_trap_risk` | 배당률이 높아진 게 좋은 신호인가, 주가 하락 착시인가? | dividend yield, payout ratio, FCF, price_change | Dividend & ETF Corner |
| `ai_expectation_vs_reality` | AI 기대가 실제 매출/마진으로 이어지고 있나? | segment revenue, margin, capex, AI-related news | Hypothesis Lab |
| `insider_signal` | 내부자가 사고 있나, 팔고 있나? | SEC Form 4 | SSMK Lens, 리스크 |
| `dilution_risk` | 주식 수가 늘어나 주주가치가 희석될 위험이 있나? | S-3, ATM, convertible notes | Risk/Turnaround |
| `buyback_quality` | 자사주매입이 실제 주주환원에 도움이 되나? | buyback amount, share count change, FCF | Dividend & ETF Corner |
| `accounting_quality_watch` | 회계나 공시에 의심 신호가 있나? | restatement, impairment, auditor change | QA/리스크 |
| `etf_concentration_risk` | ETF가 분산처럼 보여도 상위 종목에 쏠려 있나? | ETF holdings, top_10_weight | ETF Corner |

주의할 점:

Korean DART MCP는 국내 DART에 최적화되어 있다. SSMK에는 OpenDART API를 직접 연결하기보다 SEC EDGAR, 기업 IR, ETF 운용사 자료, Nasdaq/SEC/official company filings 쪽으로 미국판 프리셋을 설계해야 한다.

## 4. The Gongsi 벤치마킹

프로젝트 요약:

The Gongsi는 DART 공시를 자동 요약하고, 이상징후를 severity로 표시하며, 공급망/지분/인물 그래프 위에서 자연어 질문을 처리하는 리서치 터미널이다. 특히 "AI는 조언자가 아니라 독해기"라는 원칙이 SSMK와 잘 맞는다.

핵심 구조:

| 요소 | 의미 | SSMK 적용 아이디어 |
|---|---|---|
| anomaly severity | 이상 공시를 low/medium/high로 표시 | 자동화 대시보드와 QA Gate에 severity 표시 |
| GraphRAG | 기업, 공급망, 지분 관계를 그래프로 질의 | 향후 산업/ETF/공급망 관계 확장 |
| AI DD memo | 공시+뉴스+실적을 통합한 메모 | Docs 편집자 초안 또는 종목 딥다이브 |
| version history | 메모와 thesis의 변화 기록 | `hypothesis_evolution_log` 강화 |
| editorial UI | 정보 밀도와 심미성을 같이 추구 | Control Center/HTML 최종본 UX 개선 |
| alerts | severity별 알림 | 자동화 실패, 리스크 급등, 데이터 신뢰도 낮음 알림 |

SSMK에 가져올 것:

- AI를 투자 조언자가 아니라 원자료 독해기로 규정하는 표현
- 운영 대시보드에서 severity를 명확히 보여주는 방식
- 이상 신호와 일반 뉴스 후보를 분리하는 방식
- thesis/memo의 버전 히스토리 관리
- "광고 없는 고밀도 리서치 UI" 지향

SSMK에 적용할 대시보드 항목:

```text
이번 주 운영 판정
- success / warning / failed

콘텐츠 품질 판정
- clean / watch / warning / blocked

데이터 신뢰도 판정
- high / medium / low

리스크 severity
- low / medium / high

다음 액션
- 발행 가능
- 사용자 확인 필요
- 데이터 보강 필요
- 자동화 수정 필요
```

주의할 점:

The Gongsi는 큰 웹서비스 구조다. SSMK는 현재 Google Sheets + Apps Script 중심이므로, GraphRAG나 Neo4j 같은 구조를 바로 도입하면 과하다. 먼저 `관계형 시트 + 간단한 fact card`로 시작하고, 산업/ETF/공급망 데이터가 충분히 쌓인 뒤 그래프 구조를 검토한다.

## 5. SSMK에 반영할 설계 원칙

### 5-1. Source Layer

역할:

원자료를 가져온다.

미국증시 기준 후보:

- SEC EDGAR 10-K, 10-Q, 8-K, Form 4
- 기업 IR 페이지
- ETF 운용사 factsheet
- Nasdaq dividend page
- GoogleFinance 가격 데이터
- 공식 보도자료
- 신뢰 가능한 뉴스 후보

주의:

원자료 수집과 해석을 한 함수에 섞지 않는다.

### 5-2. Fact Engine

역할:

원자료를 비교 가능한 사실 카드로 바꾼다.

예시:

```text
MSFT
- 1주 가격 변화: +1.53%
- 4주 가격 변화: +15.98%
- SSMK 점수 변화: 8.22 -> 7.63
- 관련 뉴스: AI 투자비, 실적 기대
- 부족한 데이터: 실제 Azure 성장률, AI 투자비, 마진 변화
```

여기서는 해석하지 않는다. 숫자와 출처, 부족한 데이터만 정리한다.

### 5-3. Signal Preset

역할:

사실 카드를 투자 공부 질문으로 변환한다.

예시:

```text
고배당 함정:
배당률이 높아진 이유가 배당금 증가인지, 주가 하락인지 나눈다.

AI 기대 과열:
AI 뉴스와 실제 매출/마진 지표가 함께 움직이는지 본다.

ETF 쏠림:
ETF가 분산처럼 보이지만 상위 10개 종목에 과하게 집중되어 있는지 본다.
```

### 5-4. Story Builder

역할:

사실 카드와 signal preset을 보고서 섹션으로 조립한다.

필수 섹션:

- 이번 주 한 줄 결론
- Market Map
- Industry & Theme Board
- SSMK Stock Dashboard
- SSMK Lens Deep Dive
- Hypothesis Lab
- Dividend & ETF Corner
- Forecast vs Actual
- Hypothesis Evolution Log
- 이번 주 레슨

### 5-5. AI Explainer

역할:

초보자가 이해할 수 있게 해석한다.

좋은 설명의 순서:

```text
무슨 일이 있었나
왜 중요한가
어떻게 해석할 수 있나
반대로 틀릴 수 있는 이유는 무엇인가
초보자는 무엇을 배울 수 있나
다음에 무엇으로 확인할까
```

### 5-6. QA Gate

역할:

최종 콘텐츠로 나가면 안 되는 것을 차단한다.

차단 조건:

- 숫자 없는 지표명 나열
- "관찰 우선순위를 확인합니다" 같은 빈 문장
- 추천/매수/매도처럼 읽히는 표현
- 데이터 부족을 사실처럼 쓰는 표현
- 운영 로그나 blocked 상태가 이메일 HTML에 들어간 경우
- Dividend & ETF Corner 누락
- Forecast vs Actual 누락

### 5-7. Output Split

역할:

산출물을 목적별로 분리한다.

| 산출물 | 목적 |
|---|---|
| 운영 대시보드 | 실행 상태, 실패, 경고, 다음 액션 확인 |
| Google Docs 초안 | 편집자용 초안, QA 메모, 수정 포인트 포함 |
| Email HTML 최종본 | 독자가 읽는 학습 콘텐츠만 포함 |

## 6. 다음 개발 때 놓치지 말아야 할 구현 항목

우선순위 1:

- `report_fact_cards` 탭 또는 내부 데이터 구조 추가
- `signal_presets` 탭 또는 코드 상수 추가
- Docs 초안과 HTML 최종본 생성 로직 분리
- 콘텐츠 QA 실패 문장 목록을 코드화
- 이메일 HTML에서 운영 문구 제거

우선순위 2:

- ETF 최소 세트 자동 수집: SPY, QQQ, SCHD, XLK, XLE
- 배당주 최소 관찰: `dividend_focus=Yes` 종목 중심으로 시작
- Dividend & ETF Corner를 빈 섹션 없이 매주 생성
- Forecast vs Actual에 1주/4주 복기 상태 표시

우선순위 3:

- SEC EDGAR 기반 Form 4 내부자 시그널
- SEC/IR 기반 매출 구성과 마진 변화
- ETF 운용사 factsheet 기반 상위 보유 종목 쏠림
- hypothesis_evolution_log를 실제 가설 v1/v2/v3 흐름으로 연결

## 7. 우리 프로젝트에 맞지 않는 부분

그대로 가져오면 안 되는 것:

- DART API 자체를 중심에 두는 구조
- 한국 공시 이벤트명을 그대로 사용하는 signal preset
- 처음부터 Neo4j/GraphRAG 같은 무거운 인프라를 도입하는 것
- 전문가용 리서치 터미널처럼 너무 복잡한 UI
- 초보자가 이해하기 어려운 지표만 나열하는 방식

SSMK에 맞게 바꿔야 하는 것:

```text
한국 공시 API 중심
→ 미국 SEC/IR/ETF/가격 데이터 중심

전문가용 공시 탐색
→ 초보자 학습형 관찰 콘텐츠

AI 분석가가 판단
→ AI 독해기가 근거를 읽고, 사용자가 배울 수 있게 설명

리스크 탐지 중심
→ 리스크 탐지 + 초보자 레슨 + 다음 확인 질문
```

## 8. 다음 작업 시작 전 확인 질문

이 3개 프로젝트를 참고해 SSMK를 개선할 때는 아래 질문을 먼저 한다.

1. 이 기능은 Source, Fact, Signal, Story, Explainer, QA, Output 중 어디에 속하는가?
2. 데이터 수집과 해석이 섞여 있지는 않은가?
3. 이 기능이 초보자에게 더 좋은 질문을 만들게 해주는가?
4. 미국증시 기준 출처는 무엇인가?
5. 해당 데이터가 없을 때 솔직하게 "부족한 데이터"로 표시할 수 있는가?
6. 최종 이메일에는 독자용 콘텐츠만 남고 운영 문구는 빠지는가?
7. 배당/ETF/가설 복기/산업 테마 중 누락되는 축은 없는가?

이 질문에 답하지 못하면 구현 전에 설계를 다시 잡는다.
