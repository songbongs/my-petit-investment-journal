# 2026-05-15 Weekly Lab 콘텐츠 품질 개선 핸드오프

작성일: 2026-05-15

## 1. 이 문서를 먼저 읽어야 하는 이유

이 문서는 2026-05-15에 진행한 SSMK Weekly Lab 콘텐츠 품질 개선 작업의 이어받기 문서다.

다음에 이 프로젝트를 이어서 작업하는 사람이나 Codex는 아래 문서를 먼저 읽는다.

1. `AGENTS.md`
2. `docs/SSMK-WEEKLY-LAB-SOUL.md`
3. `docs/2026-05-15-ssmk-editorial-standard-v1.md`
4. 이 문서

이번 작업의 핵심은 단순히 문장을 예쁘게 고친 것이 아니다. 사용자가 지적한 핵심 문제는 아래였다.

```text
AI가 목록만 채우듯 쓴 글이 아니라,
초보자가 시장이 어떻게 돌아가는지 읽을 수 있게 돕는 콘텐츠가 되어야 한다.
```

따라서 앞으로의 모든 작업은 아래 질문을 통과해야 한다.

```text
이 문장은 초보자가 시장의 흐름을 읽는 법을 배우게 하는가?
아니면 그냥 안전하고 애매한 말로 넘어가는가?
```

## 2. 오늘 작업의 배경

2026-05-12 Weekly Lab 초안은 자동 생성은 되었지만, 품질이 매우 낮았다.

대표 문제:

- `확인해야 합니다`
- `주목해야 합니다`
- `질문으로 남깁니다`
- `보는 연습이 필요합니다`
- `살펴보는 방식으로 시작합니다`

이런 표현이 반복되면서, 초보자가 실제로 무엇을 배워야 하는지 알기 어려웠다.

사용자가 강조한 방향은 아래와 같다.

```text
공부용 자료라도 명확해야 한다.
이 지표가 이렇게 변했기 때문에 이런 변화로 판단할 수 있고,
이런 가정이 유지되면 이런 추세를 예상할 수 있으며,
반대로 이런 데이터가 나오면 기존 가설을 수정해야 한다는 식으로 써야 한다.
```

## 3. 오늘 추가한 기준 문서

새 문서:

```text
docs/2026-05-15-ssmk-editorial-standard-v1.md
```

이 문서는 앞으로 SSMK 리포트 문장의 편집 기준이다.

핵심 기준:

```text
실제 변화
-> 해석
-> 예상
-> 반대 시나리오
-> 가설 수정 기준
-> 초보자 레슨
-> 다음 확인 데이터
```

금지 문장:

```text
확인해야 합니다
주목해야 합니다
질문으로 남깁니다
살펴볼 필요가 있습니다
보는 연습이 필요합니다
```

이 문장을 무조건 쓰지 말라는 뜻은 아니다. 다만 이런 말로 끝나면 안 된다. 반드시 아래처럼 바꿔야 한다.

```text
X가 개선되면 A 가설을 유지한다.
X가 악화되면 B 가설로 낮춘다.
X 데이터가 없으므로 이번 해석의 신뢰도는 낮다.
다음 리포트에서는 X가 Y 방향인지 대조한다.
```

## 4. 오늘 코드에 반영한 내용

주요 수정 파일:

```text
AGENTS.md
automation/Code.gs
tests/report-builder-quality-contract.test.js
tests/publish-qc-contract.test.js
```

오늘 이전 작업과 이어져 이미 존재하던 새 테스트/문서도 있다.

```text
tests/weekly-lab-teaching-insight-contract.test.js
tests/weekly-report-html-quality-contract.test.js
tests/report-fact-cards-contract.test.js
docs/2026-05-15-0512-weekly-lab-recovery-quality-audit.md
docs/2026-05-07-weekly-lab-quality-v3-handoff.md
docs/superpowers/specs/2026-05-07-weekly-lab-quality-architecture-design.md
docs/superpowers/plans/2026-05-07-weekly-lab-quality-architecture.md
```

### 4-1. AGENTS.md

작업 전 필수 독서 문서에 아래 문서를 추가했다.

```text
docs/2026-05-15-ssmk-editorial-standard-v1.md
```

다음 작업자는 SSMK Soul뿐 아니라 Editorial Standard도 반드시 읽어야 한다.

### 4-2. starter hypothesis 문장 개선

`automation/Code.gs`에서 아래 함수의 기본 문장을 개선했다.

```text
buildStarterHypothesisSummary_()
buildStarterReasoningExplanation_()
buildStarterBeginnerLesson_()
```

이전 방향:

```text
이번 주에는 A, B, C가 이 변화와 실제 사업 흐름을 함께 설명하는지 확인하는 학습 질문으로 남깁니다.
```

현재 방향:

```text
A, B, C가 같은 방향으로 좋아지면 가격 변화가 실제 사업 기대를 반영했다는 가설을 세울 수 있다.
반대로 핵심 지표가 따라오지 않으면 가격만 먼저 움직인 기대 선반영으로 가설을 낮춘다.
```

### 4-3. 회피형 인사이트 QC 추가

`automation/Code.gs`에 아래 상수와 함수를 추가했다.

```text
WEEKLY_LAB_VAGUE_INSIGHT_PATTERNS
vagueInsightMatches_()
```

이제 Docs/HTML에 회피형 문장이 있으면 품질 게이트에서 차단될 수 있다.

차단 라벨 예시:

```text
BLOCK_VAGUE_INSIGHT: VAGUE_CONFIRM_SHOULD
BLOCK_VAGUE_INSIGHT: VAGUE_ATTENTION
BLOCK_VAGUE_INSIGHT: VAGUE_QUESTION_REMAINS
```

### 4-4. QCOM 같은 급등락 해석 개선

QCOM처럼 4주 변화폭이 비정상적으로 큰 경우, 이제 다음 문장이 들어간다.

```text
데이터 신뢰도 확인:
1주 +7.25%, 4주 +56.24%처럼 변화폭이 매우 큽니다.
먼저 실적 서프라이즈, 인수합병, 주식분할, ADR/OTC 가격 공백,
GoogleFinance 계산 오류 가능성을 대조한 뒤 해석합니다.
```

이것은 매우 중요하다. 초보자에게 큰 상승률을 그대로 믿지 말고, 먼저 데이터가 정상인지 묻는 습관을 가르치기 때문이다.

## 5. 오늘 실행한 테스트

아래 테스트를 모두 실행했고 통과했다.

```text
node tests/report-builder-quality-contract.test.js
node tests/weekly-lab-teaching-insight-contract.test.js
node tests/publish-qc-contract.test.js
node tests/weekly-report-html-quality-contract.test.js
node tests/weekly-full-cycle-contract.test.js
node tests/report-fact-cards-contract.test.js
node tests/control-center-automation-dashboard.test.js
node tests/watchlist-classification-guide.test.js
node tests/watchlist-normalization.test.js
```

테스트 결과:

```text
전체 통과
```

## 6. Apps Script 배포 상태

로컬 `automation/Code.gs`를 배포용 파일에 동기화했다.

```text
automation/Code.gs
-> .tmp/ssmk-clasp-deploy-20260506-163538/Code.js
```

그 다음 아래 명령으로 Apps Script에 push했다.

```text
npx -y @google/clasp push --force
```

결과:

```text
Pushed 3 files at PM 5:05:35.
```

주의:

```text
npx -y @google/clasp run showSsmkSetupBuild
```

위 명령은 CLI 권한 문제로 실패했다.

실패 메시지:

```text
Unable to run script function. Please make sure you have permission to run the script function.
```

즉, 배포 push는 성공했지만 CLI 함수 실행 확인은 실패했다. 이후 사용자가 Apps Script UI에서 직접 실행해 확인했다.

## 7. 사용자가 실행한 최신 복구 결과

사용자가 Apps Script에서 아래 함수를 실행했다.

```text
rebuildAndContinueWeeklyLabFullCycleFor20260512
```

최신 결과는 정상 생성됐다.

### 최신 report_runs

```text
report_id: RPT-20260512-70124
issue_date: 2026-05-12
generation_status: 초안 생성
notes: sage_qc_status=pass; score=94; qa_id=QA-20260515-171808-673-SAGE; html_version=v6
sent_at: 비어 있음
```

이메일은 발송되지 않았다.

### 최신 report_versions

최신 Docs 초안:

```text
version_label: v5
created_at: 2026-05-15 17:17:33
url: https://docs.google.com/open?id=1fSB0h86UBnqw72Er0x2JqqW84nPIKBURbBtTUc3hkzo
summary: Rebuilt Weekly Lab draft with clearer teaching-insight sections. 이메일 발송 없음.
```

최신 HTML 초안:

```text
version_label: v6
created_at: 2026-05-15 17:18:03
url: https://drive.google.com/file/d/1CJRYHGUd4nBqMkHX-k8aQVtDyPzKA0Pu/view?usp=drivesdk
summary: Email HTML final draft created. 이메일 발송 전 검토용 HTML 최종본입니다.
```

### 최신 qa_review_log

```text
qa_id: QA-20260515-171808-673-SAGE
overall_status: pass
content_quality_score: 94
checked_by: 세이지
blocked_count: 0
warning_count: 0
main_issues: 세이지 Publish QC 통과
recommended_next_action: 사용자 검토 후 승인 가능
automation_change_needed: FALSE
html_version_id: v6
```

## 8. 실제 결과물 품질 확인

### 좋아진 점

QCOM 예시는 이전보다 명확해졌다.

현재 구조:

```text
관찰된 사실:
1주 +7.25%, 4주 +56.24%, SSMK 점수 7.15

데이터 신뢰도 확인:
변화폭이 매우 크므로 실적 서프라이즈, 인수합병, 주식분할,
ADR/OTC 가격 공백, GoogleFinance 계산 오류 가능성을 먼저 대조

한 줄 가설:
실제 이벤트가 확인되면 시장은 핸드셋 수요, 라이선스 매출,
자동차 수주잔고 개선을 선반영했다고 예상 가능

반대 시나리오:
핵심 지표가 개선되지 않거나 가격만 먼저 오른 것으로 확인되면 가설 약화

가설 수정 기준:
4주 뒤에도 핵심 지표 개선 근거가 없으면
"성장 기대가 실적으로 이어진다"에서
"기대가 가격에 먼저 반영됐지만 근거 확인이 부족하다"로 낮춤
```

이전보다 훨씬 낫다. 최소한 "아무짝에도 쓸모없는 질문 문장" 상태에서는 벗어났다.

### 아직 부족한 점

중요하다. 세이지 QC는 `pass 94`지만, 콘텐츠가 사용자가 말한 "보물 같은 콘텐츠" 수준은 아니다.

아직 부족한 이유:

1. HTML 최종본에는 Hypothesis Lab의 상세 가설 카드가 충분히 살아 있지 않다.
2. Docs에는 상세 가설이 있지만 HTML은 요약 블록 위주다.
3. Market Map은 여전히 5/12 기준 ETF 데이터가 비어 있다.
4. Forecast vs Actual은 복기 데이터가 없어 실제 복기 학습이 작동하지 않는다.
5. Dividend & ETF Corner도 `shareholder_returns`, `etf_watch`, 주요 ETF 데이터 부족 때문에 아직 학습 콘텐츠로 약하다.
6. 일부 문장은 아직 "해야 합니다"가 남아 있다. 다만 이번 QC 정규식은 모든 "해야 합니다"를 차단하지는 않는다. 다음 작업에서 문맥별로 더 정교하게 다뤄야 한다.

## 9. 다음 작업 최우선 순위

다음 작업은 아래 순서로 진행한다.

### 1순위. HTML에 상세 가설 카드 포함

현재 가장 중요한 문제다.

Docs 초안에는 QCOM 같은 상세 가설 카드가 있다. 하지만 독자용 HTML은 `content_blocks`가 `실제 변화`, `해석`, `초보자 레슨`, `다음 확인 질문`을 한 덩어리로 요약하면서 상세 카드가 줄어든다.

다음 작업 목표:

```text
Hypothesis Lab HTML에도 각 가설별 상세 카드가 보여야 한다.
```

HTML에 포함할 필수 항목:

```text
관찰된 사실
데이터 신뢰도 확인
해석
한 줄 가설
근거 지표
초보자 레슨
반대 시나리오
가설 수정 기준
다음 검증 데이터
```

수정 후보:

```text
automation/Code.gs
buildHypothesisLabSection_()
contentBlock_()
renderContentBlockHtml_()
renderWeeklyLabEmailHtml_()
```

테스트 추가 후보:

```text
tests/weekly-report-html-quality-contract.test.js
tests/weekly-lab-teaching-insight-contract.test.js
```

검증해야 할 것:

```text
HTML에 QCOM의 반대 시나리오와 가설 수정 기준이 실제로 보이는가?
email_html_summary 때문에 상세 내용이 잘리지 않는가?
```

### 2순위. 5/12 과거 데이터의 ETF 공백은 인정하고, 다음 새 실행에서 검증

5/12 리포트의 Market Map이 비어 있는 것은 현재로서는 과거 데이터 한계다.

원인:

```text
5/12 당시에는 SPY, QQQ, SCHD, XLK, XLE를 별도 수집하지 않았다.
```

현재 코드는 다음 실행부터 핵심 ETF를 별도로 수집하도록 반영되어 있다.

다음 실행 때 확인할 것:

```text
market_data에 SPY, QQQ, SCHD, XLK, XLE가 들어오는가?
Market Map에서 QQQ vs SCHD 비교 문장이 실제 수치 기반으로 나오는가?
Dividend & ETF Corner에서도 주요 ETF 가격 변화가 보이는가?
```

### 3순위. Forecast vs Actual 복기 데이터 입력/자동화

현재 Forecast vs Actual은 구조는 좋아졌지만 실제 복기가 없다.

현재 상태:

```text
복기 데이터 미입력 5건
```

다음 작업 목표:

```text
지난 가설 A
-> 예상 B
-> 실제 결과 C
-> 왜 달랐는가 D
-> 가설을 E로 수정
```

이 구조를 실제 데이터로 채운다.

수정 후보:

```text
hypothesis_reviews
hypothesis_evolution_log
buildForecastVsActualSection_()
forecastVsActualText_()
```

### 4순위. 데이터 레이어 보강

현재 좋은 리포트를 만들기에는 데이터가 부족하다.

우선 보강할 데이터:

```text
company_fundamentals
shareholder_returns
etf_watch
sector_theme_scores
source_policy
```

특히 초보자용 해석에 필요한 데이터:

```text
매출 성장률
마진
FCF
배당성향
ETF 상위 보유 종목
섹터/테마별 가격 변화
실적 발표일
주요 이벤트
```

이 데이터가 있어야 "좋은 이야기"와 "실제 숫자"를 분리해서 설명할 수 있다.

### 5순위. QC 점수 기준 강화

현재 `pass 94`는 구조 기준으로는 맞지만, 사람이 보기에는 아직 부족하다.

다음 QC 강화 방향:

```text
구조가 있다 = 통과
```

가 아니라

```text
각 핵심 섹션에 실제 숫자 + 원인 해석 + 조건부 예상 + 반대 시나리오가 있다 = 통과
```

로 바꿔야 한다.

추가 차단 후보:

```text
다음 확인 질문만 있고 조건부 예상이 없음
부족한 데이터가 있는데도 pass 처리
Hypothesis Lab 상세 카드가 HTML에 없음
Market Map ETF 데이터가 없음
Forecast vs Actual이 전부 복기 데이터 미입력
```

단, 데이터가 과거라서 어쩔 수 없는 경우는 `blocked`가 아니라 `warning`으로 둘지 판단이 필요하다.

## 10. 다음 작업자가 바로 시작할 명령

로컬 테스트:

```powershell
node tests/report-builder-quality-contract.test.js
node tests/weekly-lab-teaching-insight-contract.test.js
node tests/publish-qc-contract.test.js
node tests/weekly-report-html-quality-contract.test.js
node tests/weekly-full-cycle-contract.test.js
node tests/report-fact-cards-contract.test.js
```

전체 테스트:

```powershell
node tests/control-center-automation-dashboard.test.js
node tests/watchlist-classification-guide.test.js
node tests/watchlist-normalization.test.js
```

Apps Script 배포:

```powershell
Copy-Item -LiteralPath 'automation/Code.gs' -Destination '.tmp/ssmk-clasp-deploy-20260506-163538/Code.js' -Force
npx -y @google/clasp push --force
```

Apps Script UI에서 실행할 함수:

```text
rebuildAndContinueWeeklyLabFullCycleFor20260512
```

다음 새 주간 실행 검증용 함수:

```text
runWeeklyLabFullCycle
```

단, 실제 발송 함수는 사용자 승인 없이는 실행하지 않는다.

```text
sendApprovedReport
```

위 함수는 절대 임의 실행하지 않는다.

## 11. 다음 작업 프롬프트

다음에 Codex에게 아래처럼 요청하면 이어받기 쉽다.

```text
SSMK Weekly Lab 콘텐츠 품질 개선을 이어서 진행해줘.
작업 폴더는 C:\Users\kblife\Documents\AI-Playground\SSMK-investment-journal 이야.
먼저 AGENTS.md, docs/SSMK-WEEKLY-LAB-SOUL.md, docs/2026-05-15-ssmk-editorial-standard-v1.md, docs/2026-05-15-weekly-lab-content-quality-handoff.md를 읽고 현재 상태를 파악해줘.
최신 5/12 결과는 report_id RPT-20260512-70124, Docs v5, HTML v6, Sage QC pass 94점이지만 아직 HTML에 상세 가설 카드가 충분히 살아 있지 않아.
다음 작업의 1순위는 Hypothesis Lab 상세 가설 카드가 독자용 HTML에도 보이도록 개선하고, 테스트로 QCOM의 반대 시나리오/가설 수정 기준/다음 검증 데이터가 HTML에 포함되는지 검증하는 거야.
이메일 발송은 하지 말고, 발송 관련 함수는 사용자 승인 없이는 실행하지 마.
```

## 12. 현재 작업 트리 주의사항

현재 작업 트리에는 오늘과 직전 품질 개선 작업의 변경이 함께 남아 있다.

대표 변경:

```text
AGENTS.md
automation/Code.gs
tests/report-builder-quality-contract.test.js
tests/weekly-full-cycle-contract.test.js
docs/2026-05-15-ssmk-editorial-standard-v1.md
docs/2026-05-15-0512-weekly-lab-recovery-quality-audit.md
docs/2026-05-15-weekly-lab-content-quality-handoff.md
tests/publish-qc-contract.test.js
tests/report-fact-cards-contract.test.js
tests/weekly-lab-teaching-insight-contract.test.js
tests/weekly-report-html-quality-contract.test.js
```

주의:

```text
사용자가 만들었거나 이전 작업에서 생긴 변경을 되돌리지 말 것.
특히 automation/Code.gs는 여러 품질 개선이 누적되어 있으므로 부분 revert 금지.
```

## 13. 현재 결론

오늘 작업으로 5/12 리포트는 다음 상태까지 회복됐다.

```text
실행 결과 기록 정상화
Docs v5 생성
HTML v6 생성
Sage Publish QC pass 94
이메일 발송 없음
QCOM 예시의 가설 구조 개선
회피형 문장 QC 일부 추가
```

하지만 아직 최종 목표에는 못 미친다.

다음 목표는 분명하다.

```text
독자용 HTML에서도 상세 가설 카드가 살아 있어야 한다.
Market Map은 실제 ETF 데이터로 작동해야 한다.
Forecast vs Actual은 실제 복기 데이터로 작동해야 한다.
QC는 구조 통과가 아니라 인사이트 품질 통과를 봐야 한다.
```

이 네 가지가 해결되어야 사용자가 말한 "초보자가 시장을 읽는 보물 같은 콘텐츠"에 가까워진다.
