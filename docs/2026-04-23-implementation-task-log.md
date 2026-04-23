# 2026-04-23 Implementation Task Log

## Task 1: Apps Script sheet schema v2

Status: completed

What changed:

- Expanded `SSMK.sheets` with the Weekly Lab v2 tabs.
- Added headers for source policy, market data, company fundamentals, hypothesis lab, visualization queue, report section/version tracking, revision requests, workflow logs, QA logs, and glossary tabs.
- Added `WORKBOOK_SCHEMA_SHEET_KEYS` and `ensureWorkbookSchemaSheets_(ss)` so `setupSsmkWorkbook()` can create the v2 tabs and headers in one pass.
- Kept existing `report_runs`, `hypothesis_reviews`, and agent review headers stable to avoid breaking the current draft workflow.
- Updated `automation/google-sheets-structure-plan.md` with beginner-friendly manual verification steps.

Verification:

- Passed: `node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"`
- Passed: `node -e "const fs=require('fs'); const code=fs.readFileSync('automation/Code.gs','utf8'); const api=new Function(code+'; return {SSMK, WORKBOOK_SCHEMA_SHEET_KEYS};')(); const missing=api.WORKBOOK_SCHEMA_SHEET_KEYS.filter(k=>!api.SSMK.sheets[k]||!api.SSMK.headers[k]); if(missing.length){throw new Error('Missing schema keys: '+missing.join(', '));} console.log('schema keys ok: '+api.WORKBOOK_SCHEMA_SHEET_KEYS.length);"`
- Passed: safe sensitive-name check with `rg`

Notes:

- This task creates sheet structure only. It does not yet save revision requests or write workflow run logs.

## Task 2: Default preferences and schedule policy

Status: completed

What changed:

- `user_preferences` defaults are seeded through `seedDefaultPreferences_()`.
- `automation_schedules` defaults are seeded through `seedDefaultSchedules_()`.
- Tuesday Weekly Lab generation remains the only default `ON` schedule.
- `email_auto_send` remains `OFF`, and the sidebar blocks direct OFF to ON changes.

Verification:

- Passed: default preference and schedule seeders remain connected through `ensureControlCenterSheets_(ss)`
- Passed: Tuesday Weekly Lab remains the only default `ON` schedule

Notes:

- The implementation uses `seedDefaultSchedules_()` as the schedule seeding function name, matching the existing control-center naming.

## Task 3: SSMK Control Center sidebar

Status: completed

What changed:

- Added the `SSMK Control Center` menu item and sidebar opener in `automation/Code.gs`
- Added `getControlCenterState()`, `saveUserPreferences(preferences)`, and `saveScheduleSettings(schedules)`
- Added seeded control-center sheets for `user_preferences` and `automation_schedules`
- Created `automation/SettingsSidebar.html` with:
  - 리포트 기본 설정
  - 포함 섹션
  - 자동화 스케줄
  - 재작업 요청
  - 로그 확인 안내
- Updated `automation/google-apps-script-plan.md` with the new sidebar flow and helper functions

Verification:

- Passed: `node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('syntax ok')"`
- Passed: `node -e "const fs=require('fs'); const html=fs.readFileSync('automation/SettingsSidebar.html','utf8'); const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).join('\n'); new Function(scripts); console.log('SettingsSidebar script syntax ok')"`
- Passed: safe sensitive-name check with `rg`

Notes:

- `email_auto_send` remains approval-gated. OFF to ON is blocked with a warning.
- Rework request persistence is still deferred to Task 4; the sidebar only shows a placeholder message.
- Follow-up fix: the sidebar now preserves the final save warning/status message after refreshing state.

## Task 4A: Revision request intake

Status: completed

What changed:

- Added `saveRevisionRequest(request)` in `automation/Code.gs`.
- Added validation for `report_id`, `target_scope`, `target_section`, `request_type`, and `user_instruction`.
- Connected the Control Center revision button to save rows in `revision_requests` with `status=requested`.
- Added a sidebar scope selector for section-only versus full-report revision requests.
- Updated `automation/ai-report-generation-workflow.md` with the revision request intake flow.

Verification:

- Passed: `node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); const html=fs.readFileSync('automation/SettingsSidebar.html','utf8'); const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).join('\n'); new Function(scripts); console.log('syntax ok')"`
- Passed: local `normalizeRevisionRequest_()` validation check for valid input and empty `report_id` blocking.
- Passed: safe sensitive-name check with `rg`

Notes:

- `report_sections` and `report_versions` helper functions remain deferred to the next Task 4 slice.
- Saving a revision request does not approve sending or publish a report.

## Task 4B: Report section and version tracking

Status: completed

What changed:

- Added `upsertReportSection_(reportId, sectionKey, sectionTitle, status, contentSummary)`.
- Added `createReportVersion_(reportId, versionLabel, sourceRequestId, outputUrl, notes)`.
- Added validation helpers for section status and version labels.
- Kept section rows upsert-style by `report_id + section_key`.
- Kept version rows append-only and blocked duplicate `report_id + version_label`.
- Updated `automation/ai-report-generation-workflow.md` with the section/version tracking flow.

Verification:

- Passed: `node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"`
- Passed: local section/version helper validation for valid rows, next section order, and invalid version label blocking.
- Passed: `SettingsSidebar.html` script syntax check.
- Passed: safe sensitive-name check with `rg`

Notes:

- These are Apps Script helper functions for later workflow steps. They do not generate a report by themselves.

## Task 5A: Automation run start/finish logging

Status: completed

What changed:

- Added `startAutomationRun_(runType, scheduleKey, triggerSource)`.
- Added `finishAutomationRun_(runId, status, reportId, finalOutputUrl, errorSummary, notes)`.
- Added workflow status normalization so Korean workflow labels can map to sheet-safe statuses.
- Added duration calculation from `started_at` to `ended_at`.

Verification:

- Passed: local run-log helper validation for start normalization, finish normalization, Korean status mapping, bad status blocking, and duration calculation.
- Passed: `Code.gs` and `SettingsSidebar.html` syntax checks.
- Passed: safe sensitive-name check with `rg`

Notes:

- This slice only writes the overall run row in `automation_run_log`.
- Step-level logs, error logs, bottleneck logs, and QA reviews remain deferred to the next Task 5 slice.

## Task 5B: Step, error, and bottleneck logging

Status: completed

What changed:

- Added `logAutomationStep_(runId, stepOrder, stepName, agentName, status, inputSummary, outputSummary, errorMessage, retryCount)`.
- Added `logError_(runId, stepName, severity, errorType, errorMessage, rootCauseGuess, recoveryAction)`.
- Added `logBottleneck_(runId, bottleneckType, location, symptom, impact, suggestedFix, priority, status)`.
- Added validation helpers for step, error, and bottleneck log payloads.
- Updated `automation/ai-agent-roles-and-review-board.md` with the role of `automation_step_log`, `error_log`, and `bottleneck_log`.

Verification:

- Passed: local helper validation for step, error, and bottleneck log payloads, including invalid step blocking.
- Passed: `Code.gs` and `SettingsSidebar.html` syntax checks.
- Passed: safe sensitive-name check with `rg`

Notes:

- Operator QA review logging remains deferred to Task 5C.

## Handoff after Task 5B

Current branch:

```text
codex/weekly-lab-control-center
```

Completed tasks:

```text
Task 1: Apps Script sheet schema v2
Task 2: Default preferences and schedule policy
Task 3: SSMK Control Center sidebar
Task 4: Revision request and report revision tracking
Task 5A: Automation run start/finish logging
Task 5B: Step, error, and bottleneck logging
```

Next recommended task:

```text
Task 5C: Add createOperatorQaReview_(runId, reportId)
```

Important remaining work:

```text
1. Task 5C: Operator QA review logging
2. Task 6: Weekly Lab report template redesign and Codex weekly prompt
3. Task 7: runWeeklyLabWorkflow() orchestration draft
4. Task 8: Codex scheduled automation prompt and approval-gate documentation
5. Task 9: Final verification, user runbook, and GitHub update
```

Continue prompt:

```text
SSMK 투자 관찰노트 작업을 이어서 진행해줘. 작업 폴더는 C:\Users\kblife\Documents\AI-Playground\SSMK-investment-journal 이고, 현재 브랜치는 codex/weekly-lab-control-center 야. 먼저 git status와 docs/2026-04-23-implementation-task-log.md, docs/superpowers/plans/2026-04-23-ssmk-weekly-lab-implementation.md를 확인해서 진행상황을 파악해줘. Task 1~4와 Task 5A~5B는 완료됐고, 다음은 Task 5C인 createOperatorQaReview_(runId, reportId) 추가부터 작게 진행하면 돼. 계속 짧게 끊어서 작업→검증→커밋→승인 요청 방식으로 진행해줘. 이메일 발송, 자동화 생성/수정, 중요한 운영 변경은 사용자 승인 전에는 하지 말고, 투자 추천처럼 읽히는 표현도 피해야 해.
```
