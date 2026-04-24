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
  - if blockers do not remain, leave the report in `초안 생성` meaning
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

## Task 7B: Switch the default menu entry to Weekly Lab workflow

Status: completed

What changed:

- Updated the `SSMK 자동화` menu in `automation/Code.gs`.
- Switched the default `0.` entry from `runWeeklyDraftPrepWorkflow()` to `runWeeklyLabWorkflow()`.
- Kept the old flow visible as `0-legacy. 이전 주간 초안 준비 실행` so the operator can still compare or fall back without losing the previous button.
- Updated `automation/ai-report-generation-workflow.md` so the compatibility note now matches the real menu behavior.

Verification:

- Passed: `Code.gs` syntax check
- Passed: menu/workflow reference check with `rg`
- Passed: `git diff --check`

Notes:

- This slice only changes which button is shown as the default path.
- No email sending, automation creation, or 운영 정책 change was added.
- The legacy workflow still remains callable for comparison and fallback.

## Handoff after Task 7B

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
Task 7B: Weekly Lab menu default switch
```

Next recommended task:

```text
Task 8A: Add Codex scheduled automation prompt notes and explicit approval gate wording without creating or modifying any real automation
```

Important remaining work:

```text
1. Task 8A: approval-gate wording for scheduled Codex automation docs only
2. Task 8B: finalize Task 8 documentation details if needed
3. Task 9: Final verification, user runbook, and GitHub update
```

## Task 8A: Scheduled Codex automation approval-gate wording

Status: completed

What changed:

- Updated `automation/codex-weekly-lab-automation-prompt.md` so beginners can clearly tell the difference between:
  - writing the prompt document
  - actually creating or changing a scheduled Codex automation
- Added an explicit approval-gate section with a simple example of what the AI may explain versus what it must not execute yet.
- Updated `automation/automation-evolution-approval-gate.md` to treat Codex scheduled automation create/update/delete as a major operational change.
- Added a second beginner-friendly example in the approval-gate doc so the approval rule is easier to follow later.

Verification:

- Passed: approval-gate phrase check with `rg`
- Passed: `git diff --check`

Notes:

- This slice does not create or modify any real automation.
- This slice does not create `automation/codex-revision-request-prompt.md` yet.
- Email sending and other operational changes remain blocked without user approval.

## Handoff after Task 8A

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
Task 7B: Weekly Lab menu default switch
Task 8A: Scheduled Codex automation approval-gate wording
```

Next recommended task:

```text
Task 8B: Create automation/codex-revision-request-prompt.md for requested section/full-report revisions only
```

Important remaining work:

```text
1. Task 8B: revision request prompt file
2. Task 9: final verification and beginner runbook update
3. Optional cleanup: tighten Task 8 wording if later docs diverge
```

## Task 8B: Revision request prompt file

Status: completed

What changed:

- Created `automation/codex-revision-request-prompt.md`.
- Added beginner-friendly rules for reading `revision_requests` rows with `status=requested`.
- Split the rewrite flow into:
  - `section` requests: rewrite only the requested section
  - `full_report` requests: rewrite the whole Weekly Lab draft while keeping the template structure
- Added `request_type` interpretation hints so future runs can tell the difference between requests like `make_easier`, `fix_source`, and `soften_recommendation_risk`.
- Added explicit version logging guidance for `report_versions`, including `source_request_id` linking and simple `v1 -> v1.1` / `v1 -> v2` examples.
- Added a clear Sage block rule for recommendation-like language.

Verification:

- Passed: file existence and required-line check for `revision_requests`, `section`, `full_report`, `report_versions`, `source_request_id`, and `soften_recommendation_risk`
- Passed: `git diff --check`

Notes:

- This slice only adds the prompt document.
- No real automation was created or modified.
- No email flow or external send action was added.

## Handoff after Task 8B

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
Task 7B: Weekly Lab menu default switch
Task 8A: Scheduled Codex automation approval-gate wording
Task 8B: Revision request prompt file
```

Next recommended task:

```text
Task 9A: Final verification pass across docs and prompts, then beginner-friendly runbook wording update
```

Important remaining work:

```text
1. Task 9A: final verification pass
2. Task 9B: beginner-friendly runbook/update summary
3. Optional cleanup: align any wording drift between workflow docs and prompt docs
```

## Task 9A: Final verification pass and wording alignment

Status: completed

What changed:

- Reviewed the current code and prompt/docs together instead of looking at each file alone.
- Found wording drift where some older design docs still read as if the current default flow already automates email-ready output.
- Updated `automation/ai-report-generation-workflow.md` to clearly separate the long-term target flow from the 2026-04-23 current implemented scope.
- Updated `automation/ai-report-generation-workflow.md` file-status section so it now lists the actual current prompt/docs and the real default entry point.
- Updated `automation/google-apps-script-plan.md` with a beginner-friendly "current implementation" note and the current priority functions `runWeeklyLabWorkflow()` / `createWeeklyLabPromptDoc_()`.

Verification:

- Passed: wording drift check for `runWeeklyLabWorkflow`, `legacy`, `codex-weekly-lab-automation-prompt`, and `codex-revision-request-prompt`
- Passed: `git diff --check`

Notes:

- This slice changes wording only. It does not change runtime behavior.
- Email sending, automation creation/modification, and major operational changes remain approval-gated.

## Handoff after Task 9A

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
Task 7B: Weekly Lab menu default switch
Task 8A: Scheduled Codex automation approval-gate wording
Task 8B: Revision request prompt file
Task 9A: Final verification wording alignment
```

Next recommended task:

```text
Task 9B: Write a beginner-friendly runbook/update summary for how to use the current Weekly Lab flow safely
```

Important remaining work:

```text
1. Task 9B: beginner-friendly runbook/update summary
2. Optional cleanup: historical docs that still mention old draft flow names
3. Final branch finishing decision after the runbook is written
```

## Task 9B: Beginner-friendly runbook and update summary

Status: completed

What changed:

- Updated `README.md` with a new beginner-friendly Weekly Lab runbook section.
- Clarified which files were the main outputs of this implementation slice.
- Clarified which files must actually be copied into Google Apps Script (`Code.gs`, `SettingsSidebar.html`).
- Added a step-by-step first-run checklist centered on `setupSsmkWorkbook()`.
- Added simple guidance for:
  - where to open `SSMK Control Center`
  - how to run the current Weekly Lab default flow
  - why Tuesday is the only default `ON` schedule
  - why the other automations remain `OFF`
  - which log tabs to read when something goes wrong
- Updated the README "next work" wording so it now points to `runWeeklyLabWorkflow()` instead of the older default flow name.

Verification:

- Passed: README keyword check for `runWeeklyLabWorkflow`, `setupSsmkWorkbook`, `SSMK Control Center`, `automation_run_log`, `qa_review_log`, and `tuesday_weekly_report`
- Passed: risky-expression check showed only project philosophy / warning-context matches
- Passed: `git diff --check`

Notes:

- This slice changes documentation only.
- No email sending, automation creation, or major operational change was executed.

## Handoff after Task 9B

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
Task 7B: Weekly Lab menu default switch
Task 8A: Scheduled Codex automation approval-gate wording
Task 8B: Revision request prompt file
Task 9A: Final verification wording alignment
Task 9B: Beginner-friendly runbook/update summary
```

Next recommended task:

```text
Branch finish step: decide whether to stop here, do an optional historical-doc cleanup, or prepare the branch for PR/merge
```

Important remaining work:

```text
1. Optional cleanup: historical docs that still mention older draft-flow wording
2. Branch finish decision: commit set is complete for the planned Weekly Lab foundation slice
3. If desired later: approval-based real schedule setup and send-flow testing
```

## Post-Task 9 Audit: Cross-agent review and remediation

Status: completed

What changed:

- Ran a final competitive review pass using two independent reviewers who did not implement these slices directly.
- Consolidated the bug reports into a single safe-remediation pass before editing anything.
- Hardened `automation/Code.gs` so the current Weekly Lab flow is more internally consistent:
  - `agent_review_log` now stores `run_id` and `report_id`
  - `runWeeklyLabWorkflow()` passes run/report context into the review board and downgrades the run to `warning` if QA creation fails
  - `collectWeeklyLabPromptInputs_()` now limits pending revision requests to the current report or same issue date
  - `scheduleHypothesisReviews()`, `runAgentReviewBoard()`, and `evaluateAutomationReadiness()` now use `hypothesis_lab` first and fall back to `weekly_scores`
  - `createOperatorQaReview_()` now prefers exact `run_id`, then exact `report_id`, before same-date fallback
  - revision-request status helper functions were added for `requested -> in_progress -> completed`
  - the legacy menu item and email subject were relabeled to `Weekly Lab` wording
- Updated `automation/SettingsSidebar.html` and Control Center log guidance so beginners are sent to:
  - `automation_run_log`
  - `automation_step_log`
  - `error_log`
  - `qa_review_log`
- Cleaned up old wording drift in active docs, templates, plans, and historical notes:
  - replaced `초안 생성 완료` with `초안 생성` where it described the current runtime status
  - removed or re-labeled `발행 가능 / 발행 보류 권장` where it no longer matched the current operator-facing flow
  - marked older `generateWeeklyReportDraft()`, `markReportApproved()`, and `generateHypothesisReviewDraft()` sections as long-term candidates
  - marked historical architecture/handoff docs as historical and added current-scope notes
  - corrected schema docs so `change_approval_log` no longer claims `approved_at`, and `report_runs` no longer claims `pdf_file_path`

Verification:

- Passed: `Code.gs` syntax check through `new Function(...)`
- Passed: stub validation for:
  - `collectHypothesisSignalRows_()` hypothesis-lab priority and weekly-score fallback
  - `collectWeeklyLabPromptInputs_()` revision-request scoping
  - `createOperatorQaReview_()` exact `run_id` preference over same-date fallback
  - `recordRevisionRequestResult_()` status/version helper sequence
- Passed: `SettingsSidebar.html` script syntax check
- Passed: stale-phrase search for `초안 생성 완료`, `report_runs.review_status`, `review_status = 승인`, `review_status가 초안 또는 질문 중`, `Codex 예약 작업이`
- Passed: `git diff --check`

Notes:

- Historical documents still keep long-term architecture ideas, but they now include current-implementation notes so beginners can tell "지금 되는 것"과 "나중 목표"를 구분할 수 있다.
- Email sending, real schedule automation changes, and major operational changes remain approval-gated.

## 2026-04-24 Live verification and setup hardening

Status: completed

What changed:

- Split the setup path into a fast structure pass plus optional helper steps so the bound Apps Script no longer times out on first run:
  - `setupSsmkWorkbook()`
  - `applyWeeklyScoreFormulas()`
  - `applySsmkWorkbookDropdowns()`
- Added `showSsmkSetupBuild()` so a beginner can confirm the latest `Code.gs` is really copied into Apps Script before debugging anything else.
- Replaced blocking `SpreadsheetApp.getUi().alert()` calls in the setup/debug helpers with non-blocking log + toast notifications.
- Added progress logging for setup phases so execution logs show:
  - `prepare start`
  - `control center ready`
  - `schema group 1/3 ~ 3/3 ready`
  - `watchlist normalized`
  - `score headers ready`
- Updated the menu and operator wording so the current behavior matches the code:
  - quick setup
  - setup build check
  - formula helper
  - optional dropdown helper
  - workflow step log now says formulas are checked and dropdowns are optional
- Added `.playwright-cli/` to `.gitignore` and prepared local cleanup for Playwright residue.

Live verification:

- Passed: `showSsmkSetupBuild()` on the real bound Apps Script project
- Passed: `setupSsmkWorkbook()` on the real bound Apps Script project
- Passed: `applyWeeklyScoreFormulas()` on the real bound Apps Script project
- Passed: `runWeeklyLabWorkflow()` on the real bound Apps Script project
- Confirmed from live logs:
  - `run_id: RUN-20260424-084822-588`
  - `report_id: RPT-20260422-30086`
  - prompt doc created successfully
  - `automation_run_log` and `report_runs` updated
  - `error_log` remained empty during the successful run
  - final workflow state: `초안 생성`
  - readiness score: `90`

Review-prep notes:

- PR #1 can now be reviewed as a live-verified branch, not just a local/stub-verified branch.
- The remaining dropdown helper is intentionally optional and does not block the current Weekly Lab flow.
- Email sending, real schedule automation changes, and major operational changes still remain behind explicit approval.

## 2026-04-24 Final handoff package for the next AI

Status: completed

What changed:

- Added `docs/2026-04-24-next-ai-handoff.md` as the new single-entry handoff document for future AI sessions.
- Summarized:
  - current project phase
  - live verification status
  - exact current operator flow
  - remaining risks from the solo final review
  - recommended next-phase order
  - operating constraints that must remain approval-gated
  - short prompts the user can reuse in the next session

Important note:

```text
다음 AI는 먼저 README.md,
docs/2026-04-24-next-ai-handoff.md,
docs/2026-04-23-implementation-task-log.md,
automation/Code.gs
순서로 읽는 것이 가장 안전하다.
```

## 2026-04-24 Watchlist migration hardening

Status: completed

What changed:

- Hardened `normalizeWatchlistColumns_()` so `watchlist` data is remapped by existing header names instead of inserting columns in the middle.
- Covered the two risky partial-migration cases:
  - `theme_tags` exists but `investment_style` is missing
  - `investment_style` exists but `theme_tags` is missing
- Added a preservation check so `FALSE`-like checkbox values are not turned into blanks during remapping.
- Updated `SSMK_SETUP_BUILD` to `2026-04-24-watchlist-migration-v1` so a beginner can confirm the safer build is copied into Apps Script.
- Updated the next-AI handoff so 리스크 1 is marked as handled and the next focus is 리스크 2.

Verification:

- Red check: `node tests\watchlist-normalization.test.js` failed on the old behavior because the code inserted columns after column 3.
- Passed: `node tests\watchlist-normalization.test.js`
- Passed: `node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"`
- Passed: `git diff --check`

Notes:

- This change does not send email, create or modify real scheduled automation, or change an operating policy.
- This change is a local/stub verification. It has not been live-run inside the bound Google Apps Script project yet.

## 2026-04-24 Watchlist classification guide and live sheet update

Status: completed

What changed:

- Updated the live Google Sheets `watchlist!C2:G21` range with the approved classification direction.
- Filled `theme_tags` and `investment_style` for all 20 initial watchlist rows.
- Reclassified MSFT from `게임` to `AI/클라우드/반도체 인프라`, while preserving game exposure through `theme_tags`.
- Added `WATCHLIST_CLASSIFICATION_GUIDE` and `getWatchlistClassificationGuide()` to `automation/Code.gs` so future AI sessions have a stable good example for classification.
- Updated `README.md` with beginner-friendly watchlist classification rules and the MSFT example.
- Updated `SSMK_SETUP_BUILD` to `2026-04-24-watchlist-classification-v1`.

Verification:

- Passed: live readback from `watchlist!A1:G21` after the Google Sheets update.
- Red check: `node tests\watchlist-classification-guide.test.js` failed before `getWatchlistClassificationGuide()` existed.
- Passed: `node tests\watchlist-classification-guide.test.js`

Notes:

- This change is a study-label cleanup for the watchlist, not an investment recommendation.
- This change did not send email, create or modify real scheduled automation, or publish anything externally.
