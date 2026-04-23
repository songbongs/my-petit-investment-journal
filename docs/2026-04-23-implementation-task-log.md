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

## Task 5C: Operator QA review logging

Status: completed

What changed:

- Added `createOperatorQaReview_(runId, reportId)` in `automation/Code.gs`.
- Added validation to block missing `run_id`, missing `report_id`, unfinished runs, mismatched run/report pairs, and duplicate QA reviews for the same run.
- Added starter QA scoring based on run status, step/error/bottleneck logs, report section status, visualization queue state, and agent review board results.
- Added beginner-friendly `main_issues` and `recommended_next_action` messages so `qa_review_log` can work like a final inspection row.
- Updated `automation/ai-agent-roles-and-review-board.md` so `qa_review_log` is documented as the operator's final checkpoint.

Verification:

- Passed: `node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"`
- Passed: local QA helper validation for missing input blocking, duplicate review blocking, unfinished run blocking, and successful QA row creation with derived status and score fields.
- Passed: safe sensitive-name check with `rg`

Notes:

- `createOperatorQaReview_()` creates one QA row per `run_id`.
- The function only records review data. It does not send email, create automation, or apply major operational changes.

## Handoff after Task 5C

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
Task 5C: Operator QA review logging
```

Next recommended task:

```text
Task 6: Weekly Lab report template redesign and Codex weekly prompt
```

Important remaining work:

```text
1. Task 6: Weekly Lab report template redesign and Codex weekly prompt
2. Task 7: runWeeklyLabWorkflow() orchestration draft
3. Task 8: Codex scheduled automation prompt and approval-gate documentation
4. Task 9: Final verification, user runbook, and GitHub update
```

Continue prompt:

```text
SSMK 투자 관찰노트 작업을 이어서 진행해줘. 작업 폴더는 C:\Users\kblife\Documents\AI-Playground\SSMK-investment-journal 이고, 현재 브랜치는 codex/weekly-lab-control-center 야. Task 5C는 완료됐고, 다음은 Task 6으로 넘어가면 돼. 계속 짧게 끊어서 작업→검증→커밋→승인 요청 방식으로 진행해줘. 이메일 발송, 자동화 생성/수정, 중요한 운영 변경은 사용자 승인 전에는 하지 말고, 투자 추천처럼 읽히는 표현도 피해야 해.
```

## Task 6A: Weekly Lab template outline redesign

Status: completed

What changed:

- Replaced the old `Weekly Insight` template structure with the new `Weekly Lab` section order in `templates/weekly-report-template.md`.
- Added the approved 12-section backbone:
  - Executive Dashboard
  - Market Map
  - Industry & Theme Board
  - SSMK Stock Dashboard
  - SSMK Lens Deep Dive
  - Hypothesis Lab
  - Forecast vs Actual
  - Dividend & ETF Corner
  - Hypothesis Evolution Log
  - Learning Notes
  - Sources & Limitations
  - Agent Review Board
- Kept the document beginner-friendly with simple tables and plain-language guidance.
- Softened wording that could be misread as encouraging an investment decision.

Verification:

- Passed: section-header check with `rg -n "^## " templates/weekly-report-template.md`
- Passed: manual read-through for section order and beginner-friendly wording

Notes:

- This slice changes the outline only.
- Detailed 5-hypothesis card fields and chart placeholder syntax remain for the next Task 6 slice.

## Handoff after Task 6A

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
Task 5C: Operator QA review logging
Task 6A: Weekly Lab template outline redesign
```

Next recommended task:

```text
Task 6B: Add the 5-hypothesis structure to templates/weekly-report-template.md
```

Important remaining work:

```text
1. Task 6B: Hypothesis Lab 5-card field structure
2. Task 6C: chart placeholder wording
3. Task 6D: codex-weekly-lab-automation-prompt.md creation
4. Task 7: runWeeklyLabWorkflow() orchestration draft
5. Task 8: Codex scheduled automation prompt and approval-gate documentation
6. Task 9: Final verification, user runbook, and GitHub update
```

## Task 6B: Hypothesis Lab 5-card field structure

Status: completed

What changed:

- Expanded the `Hypothesis Lab` section in `templates/weekly-report-template.md` from a simple 5-slot summary table into 5 detailed hypothesis cards.
- Each card now includes the approved fields:
  - 가설 ID
  - 가설 버전
  - 한 줄 예측
  - 근거 지표/데이터
  - 출처
  - 왜 그렇게 해석했는지
  - 레드팀 반박
  - 보완된 최종 가설
  - 예측 조건
  - 복기 조건
  - 초보자 레슨
  - 용어 주석
  - 한계와 다음 확인
- Kept the 5 approved hypothesis roles:
  - 성장주 / 빅테크
  - 산업 / 테마
  - 배당주 / 방어주
  - ETF / 시장 흐름
  - 리스크 / 턴어라운드
- Added a short beginner-friendly writing rule so the template nudges observational wording instead of decision-like language.

Verification:

- Passed: field-structure check with `rg` for the required hypothesis field labels
- Passed: manual read-through for 5-card order and beginner-friendly wording

Notes:

- This slice covers the 5 detailed hypothesis cards only.
- Chart placeholder wording and the Codex automation prompt file remain for the next Task 6 slices.

## Handoff after Task 6B

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
Task 5C: Operator QA review logging
Task 6A: Weekly Lab template outline redesign
Task 6B: Hypothesis Lab 5-card field structure
```

Next recommended task:

```text
Task 6C: Add explicit chart placeholder wording to templates/weekly-report-template.md
```

Important remaining work:

```text
1. Task 6C: chart placeholder wording
2. Task 6D: codex-weekly-lab-automation-prompt.md creation
3. Task 7: runWeeklyLabWorkflow() orchestration draft
4. Task 8: Codex scheduled automation prompt and approval-gate documentation
5. Task 9: Final verification, user runbook, and GitHub update
```

## Task 6C: Chart placeholder wording

Status: completed

What changed:

- Added explicit `![chart: ...]` placeholder blocks to the main visual sections in `templates/weekly-report-template.md`.
- Added a beginner-friendly explanation near the top of the template so users can understand:
  - what `![chart: ...]` means
  - what to write in `차트 설명`
  - what to write in `읽는 포인트`
- Added placeholder blocks for these sections:
  - Executive Dashboard
  - Market Map
  - Industry & Theme Board
  - SSMK Stock Dashboard
  - SSMK Lens Deep Dive
  - Forecast vs Actual
  - Dividend & ETF Corner
  - Hypothesis Evolution Log
- Kept the wording observational so the chart notes explain what to compare and what to check, without sounding like an investment prompt.

Verification:

- Passed: placeholder presence check for `![chart: ...]`, `차트 설명`, and `읽는 포인트`
- Passed: manual read-through for section-to-chart fit and beginner-friendly wording
- Passed: risky-expression search showed only the disclaimer line for `매수/매도` wording

Notes:

- This slice adds chart placeholder guidance only.
- The Codex automation prompt file remains for Task 6D.

## Handoff after Task 6C

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
Task 5C: Operator QA review logging
Task 6A: Weekly Lab template outline redesign
Task 6B: Hypothesis Lab 5-card field structure
Task 6C: Chart placeholder wording
```

Next recommended task:

```text
Task 6D: Create automation/codex-weekly-lab-automation-prompt.md
```

Important remaining work:

```text
1. Task 6D: codex-weekly-lab-automation-prompt.md creation
2. Task 7: runWeeklyLabWorkflow() orchestration draft
3. Task 8: Codex scheduled automation prompt and approval-gate documentation
4. Task 9: Final verification, user runbook, and GitHub update
```

## Task 6D: Weekly Lab automation prompt file

Status: completed

What changed:

- Created `automation/codex-weekly-lab-automation-prompt.md`.
- Added the approved minimum instructions:
  - check latest `weekly_scores`, `hypothesis_lab`, `visualization_queue`, `revision_requests`
  - create a Google Docs draft using `templates/weekly-report-template.md`
  - run the agent review board up to 3 times
  - if blockers remain, leave the report in `사용자 확인 필요`
  - if blockers do not remain, leave the report in `초안 생성 완료` meaning
  - do not send email
  - do not call paid APIs
- Added beginner-friendly writing rules, hypothesis-card rules, output summary expectations, and a clear forbidden-actions section.
- Kept the prompt aligned with the current Weekly Lab template and approval-gate rules.

Verification:

- Passed: file existence and required-line checks for `weekly_scores`, `hypothesis_lab`, `visualization_queue`, `revision_requests`, `Google Docs 초안`, `에이전트 리뷰 보드 최대 3회`, `이메일`, and `추가 과금 API`
- Passed: manual read-through for prompt flow, guardrails, and beginner-friendly wording

Notes:

- This slice creates the prompt file only.
- No automation was created or modified.
- The next implementation slice is the actual workflow orchestration draft in `automation/Code.gs`.

## Handoff after Task 6D

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
Task 5C: Operator QA review logging
Task 6A: Weekly Lab template outline redesign
Task 6B: Hypothesis Lab 5-card field structure
Task 6C: Chart placeholder wording
Task 6D: Weekly Lab automation prompt file
```

Next recommended task:

```text
Task 7: runWeeklyLabWorkflow() orchestration draft
```

Important remaining work:

```text
1. Task 7: runWeeklyLabWorkflow() orchestration draft
2. Task 8: Codex scheduled automation prompt and approval-gate documentation
3. Task 9: Final verification, user runbook, and GitHub update
```

## Task 7A: Weekly Lab workflow draft and prompt helper

Status: completed

What changed:

- Added `runWeeklyLabWorkflow(issueDate)` in `automation/Code.gs`.
- Added `prepareSsmkWorkbook_()` so the new workflow can prepare sheets without relying on UI alerts.
- Added `collectWeeklyLabPromptInputs_()`, `buildWeeklyLabPromptDocBody_()`, and `createWeeklyLabPromptDoc_(issueDate, runId)`.
- Connected the new workflow draft to:
  - `startAutomationRun_()`
  - `logAutomationStep_()`
  - `scheduleHypothesisReviews()`
  - `runAgentReviewBoard()`
  - `evaluateAutomationReadiness()`
  - `finishAutomationRun_()`
  - `createOperatorQaReview_()` when possible
- Connected the prompt-doc helper to `report_sections` and `report_versions` so the prompt document itself leaves a trackable draft record.
- Updated `automation/ai-report-generation-workflow.md` to explain the new Weekly Lab workflow draft and to note that the old workflow remains for compatibility.

Verification:

- Passed: `Code.gs` syntax check
- Passed: local workflow draft validation with stubs for `runWeeklyLabWorkflow()` success path, failure path, and `createWeeklyLabPromptDoc_()` output tracking
- Passed: safe sensitive-name check with `rg`

Notes:

- This slice adds the new workflow draft without switching the menu default entry yet.
- `runWeeklyDraftPrepWorkflow()` remains available for comparison and fallback.

## Handoff after Task 7A

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
Task 5C: Operator QA review logging
Task 6A: Weekly Lab template outline redesign
Task 6B: Hypothesis Lab 5-card field structure
Task 6C: Chart placeholder wording
Task 6D: Weekly Lab automation prompt file
Task 7A: Weekly Lab workflow draft and prompt helper
```

Next recommended task:

```text
Task 7B: Switch the default menu entry to runWeeklyLabWorkflow() while keeping the legacy workflow for compatibility
```

Important remaining work:

```text
1. Task 7B: menu default switch and legacy workflow relationship
2. Task 8: Codex scheduled automation prompt and approval-gate documentation
3. Task 9: Final verification, user runbook, and GitHub update
```
