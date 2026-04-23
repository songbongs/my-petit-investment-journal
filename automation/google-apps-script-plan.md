# Google Apps Script 설계 계획

작성일: 2026-04-22

## 1. 목적

이 문서는 Google Sheets, Google Docs 또는 Markdown, Gmail, Google Drive를 연결해 SSMK 주간 리포트 생성과 승인 발송을 자동화하기 위한 설계안이다.

현재 구현 기준 메모:

```text
이 문서는 장기 설계안이다.
2026-04-23 기준 현재 기본 메뉴 실행은 runWeeklyLabWorkflow()이며,
실제로 구현된 기본 범위는 Weekly Lab 입력용 Google Docs 초안 준비,
로그 기록, 리뷰 보드 점검, QA 기록까지다.
Gmail 발송과 예약 자동화 변경은 승인 전까지 실행하지 않는다.
```

초기 목표:

```text
리포트 초안 생성은 자동화한다.
이메일 발송은 사람이 승인한 뒤 실행한다.
```

---

## 2. 전체 구조

```text
Google Sheets
  ↓
Apps Script
  ↓
AI 프롬프트용 데이터 묶음 생성
  ↓
벡터 데이터 검증
  ↓
루미 리포트 초안 생성
  ↓
세이지 품질 검토
  ↓
파일럿 프로세스 확인
  ↓
노바 발전 제안 판단
  ↓
Google Docs 또는 Markdown 저장
  ↓
사람 승인
  ↓
PDF 생성
  ↓
Gmail 발송
  ↓
report_runs / hypothesis_reviews 업데이트
  ↓
agent_review_log 업데이트
  ↓
automation_stage_reviews 품질 기록
  ↓
필요 시 change_approval_log에 발전 제안 기록
```

---

## 3. 필요한 함수 목록

### 3-0. 현재 우선 사용하는 함수

```text
runWeeklyLabWorkflow(issueDate)
createWeeklyLabPromptDoc_(issueDate, runId)
```

초보자용 설명:

```text
현재는 "최종 발송 버튼"보다
"초안을 만들 재료를 안전하게 준비하는 버튼"이 먼저 구현되어 있다.
```

### 3-1. `collectWeeklyInputs()`

역할:

- `weekly_scores`에서 이번 주 데이터 읽기
- `industry_notes`에서 산업별 메모 읽기
- `news_events`에서 주요 뉴스 후보 읽기
- `hypothesis_reviews`에서 복기 대상 읽기
- AI 프롬프트에 넣을 JSON 형태로 정리

초보자용 설명:

```text
리포트를 쓰기 전에 필요한 재료를 한 바구니에 담는 함수입니다.
```

### 3-2. `buildWeeklyReportPrompt()`

역할:

- `automation/ai-prompt-weekly-report.md` 구조를 기준으로 프롬프트 생성
- 이번 주 데이터와 지난 가설 복기 데이터를 삽입

주의:

```text
프롬프트에는 반드시 투자 추천 금지와 AI 가설 6단 구조를 포함해야 합니다.
```

### 3-3. `generateWeeklyReportDraft()` (장기 후보)

역할:

- AI에게 주간 리포트 초안 생성을 요청
- 결과를 Google Docs 또는 Markdown 형태로 저장
- `report_runs.generation_status`를 `초안 생성`으로 업데이트

현재 메모:

```text
Weekly Lab 기준 현재 기본 흐름은 위 함수보다
createWeeklyLabPromptDoc_()로 입력용 Google Docs 초안을 만드는 쪽이 먼저 구현되어 있다.
즉, 이 함수 이름은 장기 설계안에 가깝고 현재 기본 메뉴 함수는 아니다.
```

### 3-4. `markReportApproved()` (장기 후보)

역할:

- 사람이 리포트를 읽고 승인했을 때 상태 업데이트
- `report_runs.approved_at` 기록
- 승인 전에는 발송 함수가 실행되지 않게 함

현재 메모:

```text
2026-04-23 기준 현재 기본 흐름은 초안 준비와 QA 기록까지다.
승인 상태 기록은 장기 설계안에 남아 있지만, 발송 단계와 함께 아직 기본 흐름에 연결하지 않았다.
```

### 3-5. `sendApprovedReport()`

역할:

- 승인된 리포트만 Gmail로 발송
- PDF 첨부 또는 Drive 링크 방식 선택
- 발송 후 `report_runs.sent_at` 기록

중요:

```text
현재 Code.gs의 sendApprovedReport()는 의도적으로 비활성화되어 있습니다.
장기적으로는 report_runs.generation_status가 승인이고 approved_at이 기록된 경우에만 실행 후보가 됩니다.
```

### 3-6. `scheduleHypothesisReviews()`

역할:

- 이번 주 AI 가설을 `hypothesis_reviews`에 저장
- 1주 후, 4주 후 복기 대상 날짜 생성

### 3-7. `generateHypothesisReviewDraft()` (장기 후보)

역할:

- 복기 대상 가설을 읽음
- 실제 결과 데이터를 함께 정리
- `automation/ai-prompt-hypothesis-review.md` 기준으로 복기 초안 생성

### 3-8. `evaluateAutomationReadiness()`

역할:

- 최근 리포트의 AI 가설 구조 완성도 확인
- 데이터 신뢰도와 불확실성 흐름 확인
- 사용자 수정량 또는 질문량 기록 확인
- 반복 수동 작업이 많은 항목 확인
- 다음 자동화 단계로 넘어갈지 제안할 근거 생성

초보자용 설명:

```text
자동화가 더 똑똑해져도 되는지 AI가 스스로 성적표를 매기는 함수입니다.
```

### 3-8-1. `runAgentReviewBoard()`

역할:

- 벡터, 루미, 세이지, 파일럿, 노바 역할별 검토를 순서대로 실행
- 각 에이전트의 결과를 `agent_review_log`에 기록
- 현재 기본 흐름에서는 차단 이슈가 없으면 `report_runs.generation_status`를 `초안 생성`으로, 이슈가 남으면 `사용자 확인 필요`로 정리하는 데 참고한다

초보자용 설명:

```text
리포트를 한 명의 AI가 혼자 만들고 혼자 통과시키지 않도록,
여러 역할의 AI가 차례대로 검사하는 절차입니다.
```

### 3-9. `createAutomationStageProposal()`

역할:

- AI가 다음 단계로 넘어가도 된다고 판단할 때 제안서 생성
- `automation_stage_reviews`에 제안 상태를 `proposed`로 기록
- 기대 효과, 위험, 되돌리는 방법을 함께 기록

중요:

```text
이 함수는 변경을 적용하지 않습니다.
사용자에게 제안만 만듭니다.
```

### 3-10. `applyApprovedChange()`

역할:

- `change_approval_log.approval_status`가 `approved`인 변경만 적용
- 적용 후 `applied_at`과 결과 메모 기록

주의:

```text
승인되지 않은 변경은 절대 적용하지 않습니다.
```

### 3-11. `showSettingsSidebar()`

역할:

- `SSMK Control Center` 사이드바를 연다
- 기본 설정, 포함 섹션, 자동화 스케줄, 로그 안내를 한 화면에서 보여준다

초보자용 설명:

```text
이 함수는 설정 창을 여는 버튼입니다.
사용자는 시트 오른쪽에서 바로 현재 상태를 보고 필요한 값만 바꿀 수 있습니다.
```

### 3-12. `getControlCenterState()`

역할:

- `user_preferences`와 `automation_schedules`의 현재 값을 읽는다
- 사이드바가 바로 그릴 수 있는 형태로 정리한다
- 포함 섹션과 잠금 설정을 구분해 보여준다

### 3-13. `saveUserPreferences(preferences)`

역할:

- 사용자가 바꾼 설정만 부분 저장한다
- 기존 행은 `setting_key`를 유지한 채 필요한 칸만 바꾼다
- `email_auto_send`가 `OFF`에서 `ON`으로 바뀌는 요청은 경고만 돌려주고 저장하지 않는다

### 3-14. `saveScheduleSettings(schedules)`

역할:

- 자동화 스케줄의 ON/OFF만 부분 저장한다
- 기존 행은 `schedule_key`를 유지한 채 필요한 칸만 바꾼다
- 나중에 Task 4 이후 스케줄이 늘어나도 같은 방식으로 처리한다

### 3-15. `SettingsSidebar.html`

화면 섹션:

```text
리포트 기본 설정
포함 섹션
자동화 스케줄
재작업 요청
로그 확인 안내
```

사용자 흐름:

```text
사이드바를 연다
현재 설정을 읽는다
필요한 값만 바꾼다
저장을 누른다
경고가 나오면 그 항목만 다시 확인한다
```

재작업 요청 안내:

```text
지금은 Task 4가 아니므로 저장하지 않는다.
버튼은 자리 표시자이며 실제 저장은 revision_requests 연결 때 한다.
```

---

## 4. 권장 실행 요일

현재 구현 우선 표:

| 요일 | 함수 | 목적 |
|---|---|---|
| 화요일 | `runWeeklyLabWorkflow()` | 현재 기본 Weekly Lab 초안 준비, 리뷰 보드, QA 기록 |
| 필요 시 | `runWeeklyDraftPrepWorkflow()` | 이전 흐름 비교/비상용 |
| 필요 시 | `showSettingsSidebar()` | Control Center에서 설정/재작업/로그 안내 확인 |

장기 설계 후보 표:

| 요일 | 함수 | 목적 |
|---|---|---|
| 월요일 | `collectWeeklyInputs()` | 데이터 재료 정리 |
| 화요일 | `generateWeeklyReportDraft()` | AI 주간 리포트 초안 생성 |
| 수요일 | `markReportApproved()`, `sendApprovedReport()` | 승인 후 발송 |
| 월말 | `generateHypothesisReviewDraft()` | 월간 복기 초안 생성 |
| 월말 | `evaluateAutomationReadiness()` | 다음 자동화 단계 후보 판단 |

---

## 5. 안전장치

발송 전 확인 조건:

```text
report_runs.generation_status = 승인
data_confidence가 낮은 항목에 한계 표시 있음
AI 가설 3개가 모두 6단 구조를 갖춤
면책 문구 포함
수신자 active = TRUE
```

주의:

```text
이 조건은 장기 발송 단계 설계 메모다.
2026-04-23 기준 sendApprovedReport()는 여전히 비활성화 상태다.
```

발송 차단 조건:

```text
report_runs.generation_status가 준비, 초안 생성 또는 사용자 확인 필요
면책 문구 없음
AI 가설에 근거 지표가 없음
데이터 신뢰도 낮음인데 한계 설명 없음
```

자동화 발전 적용 조건:

```text
automation_stage_reviews.approval_status = approved
또는 change_approval_log.approval_status = approved
```

자동화 발전 차단 조건:

```text
approval_status가 proposed, postponed, rejected 상태
위험과 되돌림 방법이 비어 있음
사용자 승인 기록이 없음
```

---

## 6. 다음 구현 파일

다음 단계에서 만들 파일:

```text
automation/Code.gs
```

처음 구현할 함수:

1. `collectWeeklyInputs()`
2. `buildWeeklyReportPrompt()`
3. `createReportRunRow()`
4. `scheduleHypothesisReviews()`
5. `evaluateAutomationReadiness()`
6. `createAutomationStageProposal()`
7. `runAgentReviewBoard()`

이메일 발송 함수는 마지막에 만든다. 이유는 리포트 초안 품질과 승인 흐름이 먼저 안정되어야 하기 때문이다.
자동화 발전 적용 함수도 마지막에 만든다. 이유는 승인 기록과 되돌림 절차가 먼저 안정되어야 하기 때문이다.
