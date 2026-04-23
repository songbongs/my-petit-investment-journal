# Google Sheets 컬럼 반영 및 Code.gs 초안 작업 기록

작성일: 2026-04-22

## 1. 이번 작업 요약

이번 작업에서는 `automation/google-sheets-structure-plan.md`와 `automation/google-apps-script-plan.md`를 기준으로 실제 Google Sheets 구조를 업데이트하고, 로컬 자동화 초안 파일 `automation/Code.gs`를 만들었다.

핵심 원칙은 그대로 유지한다.

```text
투자 추천이 아니라 투자 공부용 관찰 기록
AI 가설은 근거와 해석 과정을 함께 설명
루미/벡터/세이지/파일럿/노바 리뷰 보드로 분리 검증
중요 변경과 자동화 발전은 사용자 승인 후 적용
외부 이메일 발송은 승인 후에만 진행
```

---

## 2. 실제 Google Sheets 반영 내용

대상 파일:

```text
SSMK 투자 관찰노트 - 점수표
https://docs.google.com/spreadsheets/d/121yVeU20KkZ2szGFGPNq7H8KdLSgDgLy5y0naGzRFsA/edit
```

### 2-1. 기존 탭 업데이트

`watchlist`

- 기존 데이터를 지우지 않고 유지했다.
- `core_industry`, `theme_tags`, `investment_style` 구조에 맞게 헤더를 정리했다.
- `theme_tags`, `investment_style`은 새로 추가된 빈 입력 열이다.

`weekly_scores`

- 권장 28개 컬럼을 반영했다.
- AI 가설 구조 컬럼을 추가했다.
- 총점, 관찰 등급, 점수 변화 수식을 넣었다.

핵심 자동 계산:

```text
ssmk_total_score =
core_score * 0.30
+ shareholder_return_score * 0.20
+ industry_score * 0.20
+ business_model_score * 0.15
+ valuation_timing_score * 0.10
+ insider_event_score * 0.05
```

`score_history`

- `weekly_scores`와 같은 기본 구조로 확장했다.
- 나중에 확정된 점수를 누적 저장하는 용도다.

### 2-2. 새로 추가한 탭

아래 5개 탭을 새로 만들었다.

```text
hypothesis_reviews
report_runs
automation_stage_reviews
change_approval_log
agent_review_log
```

각 탭의 역할:

| 탭 | 역할 |
|---|---|
| `hypothesis_reviews` | AI 가설을 1주/4주 뒤 실제 결과와 비교 |
| `report_runs` | 주간 리포트 생성, 승인, 발송 상태 기록 |
| `automation_stage_reviews` | 자동화 발전 가능 여부를 점검 |
| `change_approval_log` | 중요한 변경 제안과 사용자 승인 상태 기록 |
| `agent_review_log` | 루미/벡터/세이지/파일럿/노바 검토 결과 기록 |

### 2-3. 드롭다운과 시간대

아래 항목에는 드롭다운을 넣었다.

- 관찰 등급: `높음 / 중간 / 낮음`
- 데이터 신뢰도: `높음 / 중간 / 낮음`
- 불확실성: `높음 / 중간 / 낮음`
- 리포트 상태: `준비 / 초안 생성 / 사용자 확인 필요 / 승인 / 발송 완료 / 발송 보류`
- 변경 승인 상태: `proposed / approved / rejected / postponed / applied / rolled_back`
- 에이전트 리뷰 상태: `pass / warning / block / proposal`

스프레드시트 시간대는 프로젝트 기준에 맞춰 `Asia/Seoul`로 변경했다.

---

## 3. 샘플 데이터 반영

`data/sample-score-table.csv` 기준으로 `weekly_scores`에 샘플 5개 행을 넣었다.

주의:

```text
현재 샘플 데이터는 형식 검증용이다.
실제 발행용 최신 데이터가 아니다.
```

시트의 총점은 `docs/score-model-v1.md`의 공식 가중치 수식으로 자동 계산된다. 따라서 기존 샘플 CSV에 적힌 예시 총점과 일부 숫자가 다르게 보일 수 있다. 실제 운영에서는 시트 수식을 기준으로 본다.

---

## 4. Code.gs 초안

생성한 파일:

```text
automation/Code.gs
```

현재 들어 있는 주요 함수:

| 함수 | 역할 |
|---|---|
| `setupSsmkWorkbook()` | 시트 구조, 헤더, 수식, 드롭다운 점검/보정 |
| `runWeeklyDraftPrepWorkflow()` | 주간 초안 준비 전체 실행 |
| `autoSoftenWeeklyScoreLanguage()` | 추천처럼 읽힐 수 있는 표현을 관찰형 문장으로 순화 |
| `collectWeeklyInputs()` | 주간 리포트에 필요한 데이터를 JSON으로 묶음 |
| `buildWeeklyReportPrompt()` | AI 주간 리포트 생성용 프롬프트 작성 |
| `createWeeklyPromptDoc()` | AI에게 넣을 프롬프트를 Google Docs로 저장 |
| `scheduleHypothesisReviews()` | 이번 주 가설을 1주/4주 복기 대상으로 예약 |
| `runAgentReviewBoard()` | 루미/벡터/세이지/파일럿/노바 검토 로그 생성 |
| `evaluateAutomationReadiness()` | 자동화 발전 가능성을 점검하고 기록 |
| `createAutomationStageProposal()` | 자동화 발전 제안서를 승인 대기 상태로 기록 |
| `sendApprovedReport()` | 승인 전 발송 차단. 아직 실제 발송은 비활성화 |
| `applyApprovedChange()` | 승인 전 중요 변경 적용 차단. 아직 실제 적용은 비활성화 |

문법 확인:

```text
node --check 통과
```

---

## 5. 사용자가 다음에 해야 할 수동 작업

현재 `automation/Code.gs`는 로컬 파일이다. Google Sheets 안에서 실행하려면 한 번은 직접 붙여 넣어야 한다.

초보자용 순서:

1. Google Sheets 점수표를 연다.
2. 상단 메뉴에서 `확장 프로그램`을 누른다.
3. `Apps Script`를 누른다.
4. 기본으로 보이는 `Code.gs` 파일 내용을 모두 선택한다.
5. 로컬 파일 `automation/Code.gs` 내용을 복사해서 붙여 넣는다.
6. 저장 버튼을 누른다.
7. 함수 목록에서 `setupSsmkWorkbook`을 선택한다.
8. 실행 버튼을 누른다.
9. 처음 실행할 때 권한 승인 화면이 나오면 안내에 따라 승인한다.
10. 다시 Google Sheets로 돌아오면 상단에 `SSMK 자동화` 메뉴가 생긴다.

주의:

```text
처음에는 이메일 발송 함수가 일부러 막혀 있다.
리포트 초안 품질과 승인 흐름을 확인한 뒤에만 발송 기능을 별도로 열어야 한다.
```

---

## 6. 원클릭 주간 준비 자동화

사용자 승인에 따라 `runWeeklyDraftPrepWorkflow()`를 추가했다.

이 함수 하나를 실행하면 아래 작업을 순서대로 처리한다.

```text
시트 구조 점검/보정
→ 추천처럼 읽힐 수 있는 표현 자동 순화
→ AI 프롬프트 문서 생성
→ 가설 1주/4주 복기 예약
→ 루미/벡터/세이지/파일럿/노바 리뷰 보드 실행
→ 자동화 준비도 기록
→ report_runs에 결과 요약 기록
```

초보자용으로 말하면, 기존에는 여러 버튼을 순서대로 눌러야 했지만 이제는 매주 아래 함수 하나만 실행하면 된다.

```text
runWeeklyDraftPrepWorkflow()
```

주의:

```text
이 함수는 리포트 초안 준비까지만 자동화한다.
이메일 발송, 점수 모델 변경, 데이터 출처 변경, 자동화 단계 상승은 계속 사용자 승인 후에만 진행한다.
```

---

## 7. 다음 추천 작업

1. Google Apps Script의 `Code.gs`를 로컬 `automation/Code.gs` 최신 내용으로 다시 교체한다.
2. 저장 후 함수 목록에서 `runWeeklyDraftPrepWorkflow`를 선택한다.
3. 실행한다.
4. `report_runs`에서 새 프롬프트 문서 링크와 결과 요약을 확인한다.
5. `agent_review_log`에서 `blocking = TRUE` 항목이 있는지 확인한다.
6. 차단 항목이 없으면 프롬프트 문서를 사용해 AI 주간 리포트 초안을 만든다.
7. 차단 항목이 있으면 해당 문장을 수정한 뒤 다시 `runWeeklyDraftPrepWorkflow()`를 실행한다.

자동화 발전이나 중요한 변경은 계속 아래 규칙을 따른다.

```text
AI 제안서 작성 → 사용자 승인/보류/거절 → 승인된 변경만 적용
```
