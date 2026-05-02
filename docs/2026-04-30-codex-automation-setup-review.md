# 2026-04-30 Codex 예약 자동화 설정 및 구조 점검

## 1. 오늘 적용한 운영 변경

2026-04-30에 사용자 승인 후 Codex 예약 자동화를 생성했다.

```text
예약 이름: SSMK Weekly Lab draft automation
예약 ID: ssmk-weekly-lab-draft-automation
실행 시점: 매주 화요일 오전 8시, Asia/Seoul 기준
작업 폴더: C:\Users\kblife\Documents\AI-Playground\SSMK-investment-journal
```

이 예약 작업은 이메일 발송을 하지 않는다. 2026-04-30 추가 보강으로 발송 전 검토용 `createEmailFinalReportDraft(reportId)`는 만들 수 있지만, 이것은 HTML 파일 생성일 뿐 실제 메일 발송이 아니다.

## 2. 예약 작업이 해야 하는 일

예약 작업의 기본 목표는 아래와 같다.

```text
1. Google Sheets의 최신 관찰 데이터를 확인한다.
2. Weekly Lab 초안 또는 입력 프롬프트용 Google Docs 문서를 만든다.
3. report_runs, automation_run_log, automation_step_log, qa_review_log에 실행 흔적을 남긴다.
4. 문제가 있으면 error_log 또는 최종 보고에 사용자 확인 필요로 남긴다.
5. 이메일은 보내지 않는다.
6. 사용자가 원하면 별도 버튼으로 이메일용 HTML 최종본만 만든다.
```

## 3. 구조 점검 결과

좋은 점:

- Google Sheets는 데이터 저장소와 로그판 역할을 이미 갖추고 있다.
- `automation/Code.gs`의 `runWeeklyLabWorkflow()`는 시트 구조 점검, 문장 순화, Docs 초안 생성, 가설 복기 예약, 에이전트 리뷰, 준비도 평가, QA 로그까지 한 번에 연결한다.
- `email_auto_send`는 기본 `OFF`이며, Control Center에서 바로 `ON`으로 바뀌지 않도록 막혀 있다.
- `createEmailFinalReportDraft(reportId)`는 Google Drive에 이메일 검토용 HTML 파일을 만들고 `report_versions`에 버전 이력을 남긴다.
- `sendApprovedReport(reportId)`는 `report_runs.generation_status`가 `승인`일 때만 HTML 이메일을 보낼 수 있다. 자동 발송 버튼은 만들지 않았고, `email_auto_send`는 계속 `OFF`가 기본값이다.
- `syncWeeklyLabTriggerFromControlCenter()`는 Control Center의 요일/시간 설정을 읽어 `scheduledWeeklyLabTrigger()` Apps Script 자체 예약을 만든다.
- 2026-04-30 추가 보강으로 `scheduledWeeklyLabTrigger()`는 이제 `runWeeklyLabFullCycle()`을 호출한다. 이 함수는 watchlist 기준 1차 가격/거래량 자료 생성, Google News RSS 뉴스 후보 수집, `market_data`/`news_events` 기록, `weekly_scores` 생성, 스코어링 수식 반영, Google Docs 보고서 초안 생성, 이메일용 HTML 최종본 생성, QA 로그를 한 번에 수행한다.

주의할 점:

- 현재 Codex 세션에는 Google Apps Script 함수를 직접 실행하는 전용 도구가 보이지 않는다.
- 그래서 예약 작업은 1순위로 기존 Apps Script 실행을 시도하되, 불가능하면 Google Sheets/Docs 커넥터로 같은 산출물과 로그를 만드는 방식으로 안내되어 있다.
- `runWeeklyLabWorkflow()`는 QA 리뷰를 만들기 전에 `automation_run_log`를 먼저 완료 처리해야 한다. 이유는 `createOperatorQaReview_()`가 완료된 run만 검토하도록 설계되어 있기 때문이다. 대신 2026-04-30에 QA 성공 후 `finishAutomationRun_()`을 한 번 더 호출해 최종 종료 시간과 메모가 QA 단계까지 반영되도록 보완했다.
- Control Center의 스케줄 ON/OFF와 요일/시간은 Apps Script 자체 예약에 반영할 수 있다. 단, Codex 앱 자체 예약은 여전히 Control Center에서 직접 수정하지 않는다.

## 4. 다음 확인 순서

오늘 강제 실행을 할 때는 아래 순서로 확인한다.

```text
1. automation_schedules에서 tuesday_weekly_report가 ON인지 확인
2. user_preferences에서 email_auto_send가 OFF인지 확인
3. 오늘 기준으로 예약 작업과 같은 프롬프트를 수동 실행
4. automation_run_log에 새 run_id가 생겼는지 확인
5. automation_step_log에 단계별 기록이 생겼는지 확인
6. report_runs에 새 Google Docs URL이 생겼는지 확인
7. qa_review_log에 QA 결과가 남았는지 확인
8. error_log가 비어 있거나, 에러가 있으면 원인/복구 액션이 적혔는지 확인
9. 이메일용 HTML 최종본이 필요하면 Control Center에서 report_id를 입력하고 HTML 최종본을 만든다
```

강제 실행 정책:

```text
forceRunWeeklyLabFullCycleForToday()
→ 기본값. 오늘 기준 기존 작업 흔적이 있으면 이어서 진행한다.

forceRestartWeeklyLabFullCycleForToday()
→ 오늘 기준 market_data, news_events, weekly_scores, sector_theme_scores, visualization_queue, hypothesis_reviews 같은 작업 행을 지우고 처음부터 다시 만든다.
→ automation_run_log, automation_step_log, report_runs, report_sections, report_versions, qa_review_log, Google Docs/Drive 파일은 운영 감사 이력으로 남긴다.
```

## 5. 남은 개선 후보

우선순위가 높은 개선 후보는 아래 3개다.

1. 실제 Google Apps Script 편집기에 최신 `Code.gs`와 `SettingsSidebar.html`을 붙여 넣고 `Apps Script 예약 적용` 버튼을 눌러 트리거 생성 권한을 승인한다.
2. 2~4회 반복 실행 후 `automation_run_log`, `automation_step_log`, `qa_review_log`의 패턴을 보고 중복 로그나 느린 구간을 줄인다.
3. 이메일용 HTML 최종본이 실제 메일 클라이언트에서 읽기 좋은지 확인한 뒤, 발송 승인 UX를 별도 단계로 설계한다.
4. Codex 예약 작업이 대체 실행 경로를 탔을 때도 Apps Script 실행과 같은 로그 모양을 유지하는지 확인한다.
