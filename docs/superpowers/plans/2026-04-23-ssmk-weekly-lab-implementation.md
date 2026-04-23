# SSMK Weekly Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SSMK Weekly Lab을 Google Sheets, Apps Script, Codex 예약 자동화가 함께 움직이는 학습형 리포트 생성 시스템으로 구현한다.

**Architecture:** Google Sheets는 데이터 저장소와 상태판 역할을 맡고, Apps Script는 시트 구조, 설정 화면, 재작업 요청, 로그 기록을 담당한다. AI 리포트 작성과 에이전트 리뷰 루프는 추가 과금 API 호출 없이 Codex/ChatGPT 구독 기반 예약 작업이 수행하며, 중요한 자동화 변경과 외부 발송은 사용자 승인 전에는 적용하지 않는다.

**Tech Stack:** Google Sheets, Google Apps Script, Google Docs, Codex Desktop automation, GitHub, Markdown

---

## 0. 구현 전 고정 규칙

이 계획을 실행하는 모든 작업자는 아래 규칙을 먼저 확인한다.

- 프로젝트 문서, 코드, 시트, 프롬프트, 리포트 어디에도 금지된 외부 인물/브랜드 직접 언급을 남기지 않는다.
- 투자 추천, 매수 권유, 수익 보장처럼 읽히는 표현을 만들지 않는다.
- 추가 과금 API 호출 방식은 사용하지 않는다.
- 이메일 발송은 기본 OFF로 유지한다.
- 자동화 발전, 점수 모델 변경, 데이터 출처 정책 변경은 제안서 작성 후 사용자 승인 전에는 적용하지 않는다.
- 모든 실행은 `run_id` 기준으로 로그를 남긴다.

## 1. 파일 구조

이번 구현에서 다룰 파일과 역할은 아래와 같다.

- Modify: `automation/Code.gs`
  - Google Sheets 탭 생성, 헤더 관리, 기본값 주입, 로그 기록, 주간 워크플로 상태 관리
- Create: `automation/SettingsSidebar.html`
  - 사용자가 설정과 재작업 요청을 쉽게 조작하는 사이드바 UI
- Modify: `automation/google-apps-script-plan.md`
  - 실제 구현 함수 목록과 운영 방식 업데이트
- Modify: `automation/google-sheets-structure-plan.md`
  - 새 탭, 새 컬럼, 초기 ON/OFF 정책 반영
- Modify: `automation/ai-report-generation-workflow.md`
  - Codex 예약 자동화가 리포트 생성과 리뷰 루프를 수행하는 흐름 반영
- Modify: `automation/ai-agent-roles-and-review-board.md`
  - 레드팀과 오퍼레이터 역할을 공식 리뷰 루프에 추가
- Modify: `templates/weekly-report-template.md`
  - SSMK Weekly Lab 목차, 시각화 큐, 핵심 가설 5개, Forecast vs Actual 구조 반영
- Create: `automation/codex-weekly-lab-automation-prompt.md`
  - 화요일 오전 예약 자동화에 넣을 프롬프트 원문
- Create: `automation/codex-revision-request-prompt.md`
  - 사용자가 시트에서 재작업을 요청했을 때 Codex가 처리할 프롬프트 원문
- Create: `docs/2026-04-23-implementation-task-log.md`
  - 작업 실행 기록, 검증 결과, 보류된 결정 기록

## 2. 구현 순서 요약

1. Apps Script 시트 구조를 SSMK Weekly Lab v2 구조로 확장한다.
2. 설정 화면인 `SSMK Control Center`를 만든다.
3. 재작업 요청과 섹션별 버전 기록을 연결한다.
4. 로그와 QA 탭을 모든 실행 단계에 연결한다.
5. 리포트 템플릿과 Codex 예약 자동화 프롬프트를 개편한다.
6. 화요일 Weekly Lab 자동 생성만 ON으로 두고 나머지 스케줄은 OFF 상태로 구조만 만든다.
7. GitHub에 커밋하고 사용자가 실제 Google Sheets/Apps Script에 반영할 수 있는 실행 안내를 남긴다.

---

### Task 1: Apps Script 시트/컬럼 v2 구조 정의

**Files:**
- Modify: `automation/Code.gs`
- Modify: `automation/google-sheets-structure-plan.md`
- Create: `docs/2026-04-23-implementation-task-log.md`

- [x] **Step 1: 현재 `SSMK.sheets` 목록을 v2 탭 구조로 확장한다**

`automation/Code.gs`의 `SSMK.sheets`에 아래 탭을 추가한다.

```javascript
userPreferences: 'user_preferences',
sourcePolicy: 'source_policy',
automationSchedules: 'automation_schedules',
marketData: 'market_data',
companyFundamentals: 'company_fundamentals',
revenueBreakdown: 'revenue_breakdown',
shareholderReturns: 'shareholder_returns',
insiderActivity: 'insider_activity',
etfWatch: 'etf_watch',
sectorThemeScores: 'sector_theme_scores',
hypothesisLab: 'hypothesis_lab',
hypothesisEvolutionLog: 'hypothesis_evolution_log',
visualizationQueue: 'visualization_queue',
reportSections: 'report_sections',
reportVersions: 'report_versions',
revisionRequests: 'revision_requests',
automationRunLog: 'automation_run_log',
automationStepLog: 'automation_step_log',
bottleneckLog: 'bottleneck_log',
errorLog: 'error_log',
qaReviewLog: 'qa_review_log',
glossary: 'glossary',
```

- [x] **Step 2: v2 헤더를 `SSMK.headers`에 추가한다**

각 탭은 설계 문서의 컬럼명을 그대로 사용한다. 예를 들어 `hypothesis_lab`는 아래 컬럼을 포함한다.

```javascript
hypothesisLab: [
  'hypothesis_id',
  'hypothesis_version',
  'issue_date',
  'hypothesis_type',
  'related_tickers',
  'related_industry',
  'one_line_forecast',
  'evidence_metrics',
  'source_summary',
  'interpretation',
  'red_team_challenge',
  'revised_hypothesis',
  'forecast_condition',
  'review_condition',
  'beginner_lesson',
  'glossary_terms',
  'confidence_level',
  'status',
],
```

- [x] **Step 3: `setupSsmkWorkbook()`이 모든 v2 탭을 생성하도록 수정한다**

`setupSsmkWorkbook()` 내부에서 기존 탭뿐 아니라 v2 탭 전체에 대해 `ensureSheet_()`와 `setHeaders_()`를 호출한다.

Expected:

```text
setupSsmkWorkbook() 한 번 실행 시 새 탭이 자동 생성된다.
기존 행 데이터는 삭제되지 않는다.
첫 행 헤더와 드롭다운만 보정된다.
```

- [x] **Step 4: 작업 로그 문서를 만든다**

`docs/2026-04-23-implementation-task-log.md`에 아래 구조를 추가한다.

```markdown
# 2026-04-23 Implementation Task Log

## Task 1

- Status: planned
- Files touched:
- Verification:
- Issues:
- Next:
```

- [x] **Step 5: 금지어 검사를 실행한다**

Run:

```powershell
$term = [string]::Join('', @([char]0xC18C,[char]0xC218,[char]0xBABD,[char]0xD0A4,[char]0xC774))
rg $term README.md docs automation reports templates data
```

Expected:

```text
No matches
```

민감 명칭은 이 계획 문서에도 직접 적지 않는다. 위 명령은 글자 코드를 조립해 검사하므로 문서 자체에는 민감 명칭이 남지 않는다.

- [x] **Step 6: 커밋한다**

Run:

```powershell
git add automation/Code.gs automation/google-sheets-structure-plan.md docs/2026-04-23-implementation-task-log.md
git commit -m "feat: define weekly lab sheet schema"
```

---

### Task 2: 기본 설정값과 스케줄 ON/OFF 정책 주입

**Files:**
- Modify: `automation/Code.gs`
- Modify: `automation/google-sheets-structure-plan.md`

- [x] **Step 1: `seedDefaultPreferences_()` 함수를 추가한다**

아래 기본 설정을 `user_preferences`에 주입한다.

```javascript
[
  ['report_depth', 'dashboard_plus_explainer', 'select', '리포트 깊이', 'dashboard_only,dashboard_plus_explainer,deep_research', true],
  ['core_hypothesis_count', '5', 'number', '핵심 가설 개수', '3,5,7', true],
  ['review_loop_limit', '3', 'number', '에이전트 리뷰 반복 제한', '1,2,3', true],
  ['final_output_type', 'google_docs_draft', 'select', '최종 결과물', 'google_docs_draft,markdown', true],
  ['email_auto_send', 'OFF', 'switch', '이메일 자동 발송', 'ON,OFF', true],
  ['require_user_approval_for_major_change', 'ON', 'switch', '중요 변경 사용자 승인 필요', 'ON,OFF', false],
]
```

- [x] **Step 2: `seedDefaultSchedules_()` 함수를 추가한다**

초기 스케줄은 아래처럼 저장한다.

```javascript
[
  ['monday_data_check', '월요일 데이터 상태 점검', 'OFF', 'weekly_monday_night', '', '구조만 준비'],
  ['tuesday_weekly_report', '화요일 Weekly Lab 자동 생성', 'ON', 'weekly_tuesday_morning', '', '초기 자동화 대상'],
  ['wednesday_revision_review', '수요일 재작업 요청 반영', 'OFF', 'weekly_wednesday_morning', '', '사용자 승인 후 ON'],
  ['monthly_hypothesis_review', '월말 가설 복기', 'OFF', 'monthly_end', '', '사용자 승인 후 ON'],
]
```

- [x] **Step 3: `setupSsmkWorkbook()` 끝에서 기본값 함수를 호출한다**

Expected:

```text
빈 시트에는 기본값이 들어간다.
이미 같은 setting_key 또는 schedule_key가 있으면 덮어쓰지 않는다.
```

- [x] **Step 4: 수동 검증 절차를 문서에 남긴다**

`automation/google-sheets-structure-plan.md`에 초보자용 확인 예시를 추가한다.

```text
확인 방법:
1. Apps Script에서 setupSsmkWorkbook() 실행
2. Google Sheets로 돌아가기
3. user_preferences 탭에서 report_depth가 보이는지 확인
4. automation_schedules 탭에서 tuesday_weekly_report만 ON인지 확인
```

- [x] **Step 5: 커밋한다**

Run:

```powershell
git add automation/Code.gs automation/google-sheets-structure-plan.md
git commit -m "feat: seed weekly lab settings"
```

---

### Task 3: SSMK Control Center 사이드바 만들기

**Files:**
- Create: `automation/SettingsSidebar.html`
- Modify: `automation/Code.gs`
- Modify: `automation/google-apps-script-plan.md`

- [x] **Step 1: 메뉴에 설정 화면 버튼을 추가한다**

`onOpen()` 메뉴에 아래 항목을 추가한다.

```javascript
.addItem('설정 열기: SSMK Control Center', 'showSettingsSidebar')
```

- [x] **Step 2: `showSettingsSidebar()` 함수를 추가한다**

```javascript
function showSettingsSidebar() {
  const html = HtmlService
    .createHtmlOutputFromFile('SettingsSidebar')
    .setTitle('SSMK Control Center');
  SpreadsheetApp.getUi().showSidebar(html);
}
```

- [x] **Step 3: 설정 조회/저장 함수를 추가한다**

추가 함수:

```javascript
function getControlCenterState()
function saveUserPreferences(preferences)
function saveScheduleSettings(schedules)
```

Expected:

```text
사이드바가 현재 설정을 읽어온다.
사용자가 바꾼 값만 저장한다.
email_auto_send는 OFF에서 ON으로 바꾸려 할 때 경고 문구를 반환한다.
```

- [x] **Step 4: `SettingsSidebar.html` 기본 UI를 만든다**

화면 섹션:

```text
1. 리포트 기본 설정
2. 포함 섹션
3. 자동화 스케줄
4. 재작업 요청
5. 로그 확인 안내
```

버튼:

```text
저장
재작업 요청 저장
최신 로그 위치 보기
```

- [x] **Step 5: UI 문구는 초보자 친화적으로 작성한다**

예:

```text
핵심 가설 개수
한 주에 깊게 추적할 핵심 질문의 개수입니다. 처음에는 5개를 권장합니다.
```

- [x] **Step 6: 커밋한다**

Run:

```powershell
git add automation/Code.gs automation/SettingsSidebar.html automation/google-apps-script-plan.md
git commit -m "feat: add weekly lab control center"
```

---

### Task 4: 재작업 요청과 리포트 버전 관리 연결

**Files:**
- Modify: `automation/Code.gs`
- Modify: `automation/ai-report-generation-workflow.md`

- [x] **Step 1: `saveRevisionRequest(request)` 함수를 추가한다**

필수 입력:

```javascript
{
  report_id: 'RPT-20260428-12345',
  target_scope: 'section',
  target_section: 'Hypothesis Lab',
  request_type: 'add_more_data',
  user_instruction: '근거 지표를 더 구체적인 숫자로 보여줘',
}
```

Expected:

```text
revision_requests 탭에 새 행이 추가된다.
status는 requested로 시작한다.
created_at과 request_id가 자동으로 들어간다.
```

- [ ] **Step 2: `report_sections` 기록 함수를 추가한다**

추가 함수:

```javascript
function upsertReportSection_(reportId, sectionKey, sectionTitle, status, contentSummary)
```

Expected:

```text
리포트가 섹션 단위로 추적된다.
사용자가 전체가 아니라 특정 섹션만 재작업 요청할 수 있다.
```

- [ ] **Step 3: `report_versions` 기록 함수를 추가한다**

추가 함수:

```javascript
function createReportVersion_(reportId, versionLabel, sourceRequestId, outputUrl, notes)
```

Expected:

```text
v1, v2, v3처럼 리포트 수정 이력이 남는다.
어떤 재작업 요청 때문에 버전이 바뀌었는지 추적된다.
```

- [x] **Step 4: 재작업 유형 드롭다운을 추가한다**

드롭다운 값:

```javascript
[
  'make_easier',
  'add_more_data',
  'add_visuals',
  'make_more_human',
  'strengthen_forecast',
  'soften_recommendation_risk',
  'fix_source',
  'rewrite_with_red_team',
]
```

- [ ] **Step 5: 커밋한다**

Run:

```powershell
git add automation/Code.gs automation/ai-report-generation-workflow.md
git commit -m "feat: track report revisions"
```

---

### Task 5: 실행 로그, 오류 로그, 병목 로그, QA 로그 연결

**Files:**
- Modify: `automation/Code.gs`
- Modify: `automation/ai-agent-roles-and-review-board.md`

- [ ] **Step 1: `startAutomationRun_()` 함수를 추가한다**

입력:

```javascript
function startAutomationRun_(runType, scheduleKey, triggerSource)
```

Expected:

```text
automation_run_log에 run_id, started_at, status=running이 기록된다.
```

- [ ] **Step 2: `finishAutomationRun_()` 함수를 추가한다**

입력:

```javascript
function finishAutomationRun_(runId, status, reportId, finalOutputUrl, errorSummary, notes)
```

Expected:

```text
ended_at, total_duration_sec, final_output_url이 기록된다.
```

- [ ] **Step 3: `logAutomationStep_()` 함수를 추가한다**

기록 컬럼:

```text
run_id, step_order, step_name, agent_name, started_at, ended_at,
duration_sec, status, input_summary, output_summary, error_message, retry_count
```

- [ ] **Step 4: `logError_()`와 `logBottleneck_()`을 추가한다**

Expected:

```text
오류가 나도 어느 단계에서 왜 멈췄는지 error_log에 남는다.
느린 단계나 반복 실패는 bottleneck_log에 남는다.
```

- [ ] **Step 5: 오퍼레이터 QA 함수를 추가한다**

추가 함수:

```javascript
function createOperatorQaReview_(runId, reportId)
```

평가 항목:

```text
content_quality_score
data_quality_score
visualization_quality_score
process_efficiency_score
main_issues
recommended_next_action
automation_change_needed
```

- [ ] **Step 6: 커밋한다**

Run:

```powershell
git add automation/Code.gs automation/ai-agent-roles-and-review-board.md
git commit -m "feat: add workflow logging and operator qa"
```

---

### Task 6: Weekly Lab 리포트 템플릿 개편

**Files:**
- Modify: `templates/weekly-report-template.md`
- Create: `automation/codex-weekly-lab-automation-prompt.md`

- [ ] **Step 1: 템플릿 목차를 새 구조로 바꾼다**

필수 섹션:

```text
Executive Dashboard
Market Map
Industry & Theme Board
SSMK Stock Dashboard
SSMK Lens Deep Dive
Hypothesis Lab
Forecast vs Actual
Dividend & ETF Corner
Hypothesis Evolution Log
Learning Notes
Sources & Limitations
Agent Review Board
```

- [ ] **Step 2: 핵심 가설 5개 구조를 템플릿에 넣는다**

각 가설은 아래 필드를 가진다.

```text
가설 ID
가설 버전
한 줄 예측
근거 지표/데이터
출처
왜 그렇게 해석했는지
레드팀 반박
보완된 최종 가설
예측 조건
복기 조건
초보자 레슨
용어 주석
한계와 다음 확인
```

- [ ] **Step 3: 시각화 자리표시 문구를 명확히 넣는다**

예:

```markdown
![chart: market_map_4w_line]

차트 설명:
SPY, QQQ, SCHD, XLK, XLE의 4주 흐름을 비교합니다.
QQQ가 SPY보다 강하면 성장주 쪽으로 자금이 더 붙었는지 확인합니다.
```

- [ ] **Step 4: Codex 예약 자동화 프롬프트를 만든다**

`automation/codex-weekly-lab-automation-prompt.md`에는 아래 지시를 포함한다.

```text
Google Sheets의 최신 weekly_scores, hypothesis_lab, visualization_queue, revision_requests를 확인한다.
SSMK Weekly Lab 템플릿에 맞춰 Google Docs 초안을 만든다.
에이전트 리뷰 보드를 최대 3회 반복한다.
차단 항목이 남으면 report_runs 상태를 사용자 확인 필요로 둔다.
차단 항목이 없으면 report_runs 상태를 초안 생성 완료로 둔다.
이메일은 보내지 않는다.
추가 과금 API를 호출하지 않는다.
```

- [ ] **Step 5: 커밋한다**

Run:

```powershell
git add templates/weekly-report-template.md automation/codex-weekly-lab-automation-prompt.md
git commit -m "docs: redesign weekly lab report template"
```

---

### Task 7: `runWeeklyLabWorkflow()` 오케스트레이션 초안

**Files:**
- Modify: `automation/Code.gs`
- Modify: `automation/ai-report-generation-workflow.md`

- [ ] **Step 1: 새 워크플로 함수 이름을 추가한다**

```javascript
function runWeeklyLabWorkflow(issueDate) {
  const runId = startAutomationRun_('weekly_lab', 'tuesday_weekly_report', 'manual_or_schedule');
  try {
    setupSsmkWorkbook();
    const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
    logAutomationStep_(runId, 1, 'setup_workbook', '오퍼레이터', 'success', '시트 구조 점검', '탭/헤더 확인', '', 0);
    const promptResult = createWeeklyLabPromptDoc_(targetIssueDate, runId);
    const checks = runAgentReviewBoard(targetIssueDate, runId);
    const blockingCount = checks.filter((check) => check.blocking).length;
    const finalStatus = blockingCount > 0 ? '사용자 확인 필요' : '초안 생성 준비 완료';
    finishAutomationRun_(runId, finalStatus, promptResult.reportId, promptResult.url, '', '이메일 발송 없음');
    return { run_id: runId, report_id: promptResult.reportId, prompt_url: promptResult.url, blocking_count: blockingCount };
  } catch (error) {
    logError_(runId, 'runWeeklyLabWorkflow', 'high', 'workflow_error', error.message, '워크플로 실행 중 예외', '로그 확인 후 재실행');
    finishAutomationRun_(runId, 'failed', '', '', error.message, '자동 복구 없음');
    throw error;
  }
}
```

- [ ] **Step 2: 기존 `runWeeklyDraftPrepWorkflow()`와의 관계를 정한다**

Expected:

```text
기존 함수는 하위 호환용으로 남긴다.
메뉴의 기본 실행 항목은 runWeeklyLabWorkflow()로 교체한다.
```

- [ ] **Step 3: `createWeeklyLabPromptDoc_()`를 만든다**

Expected:

```text
Google Docs 문서에는 최종 리포트가 아니라 Codex 예약 자동화가 사용할 입력 프롬프트와 데이터 요약이 들어간다.
추가 과금 API 호출은 없다.
```

- [ ] **Step 4: 커밋한다**

Run:

```powershell
git add automation/Code.gs automation/ai-report-generation-workflow.md
git commit -m "feat: orchestrate weekly lab workflow"
```

---

### Task 8: Codex 예약 자동화 설정안 만들기

**Files:**
- Create: `automation/codex-revision-request-prompt.md`
- Modify: `automation/automation-evolution-approval-gate.md`
- Modify: `docs/2026-04-23-implementation-task-log.md`

- [ ] **Step 1: 화요일 Weekly Lab 자동화 프롬프트를 최종 확인한다**

확인 기준:

```text
추가 과금 API 호출 금지
Google Sheets 상태 확인
Google Docs 초안 생성
에이전트 리뷰 보드 최대 3회 반복
차단 항목이 있으면 사용자 확인 필요
이메일 발송 금지
```

- [ ] **Step 2: 재작업 요청 처리 프롬프트를 만든다**

`automation/codex-revision-request-prompt.md`는 아래 일을 한다.

```text
revision_requests에서 status=requested인 행을 찾는다.
target_scope가 section이면 해당 섹션만 재작성한다.
target_scope가 full_report이면 전체 리포트를 재작성한다.
수정 후 report_versions에 새 버전을 남긴다.
추천화 표현이 생기면 세이지가 block 처리한다.
```

- [ ] **Step 3: 예약 자동화 생성은 사용자 승인 후 실행한다고 문서화한다**

`automation/automation-evolution-approval-gate.md`에 아래 원칙을 추가한다.

```text
Codex 예약 자동화 생성/수정/삭제는 중요한 운영 변경으로 본다.
AI가 자동화 생성 제안서를 만들고 사용자가 승인한 뒤에만 automation_update 도구를 실행한다.
```

- [ ] **Step 4: 커밋한다**

Run:

```powershell
git add automation/codex-revision-request-prompt.md automation/automation-evolution-approval-gate.md docs/2026-04-23-implementation-task-log.md
git commit -m "docs: plan codex scheduled automation"
```

---

### Task 9: 최종 검증과 GitHub 업데이트

**Files:**
- All changed files

- [ ] **Step 1: 금지어와 추천화 표현을 검사한다**

Run:

```powershell
rg "매수|매도|추천|수익 보장|확실한 기회|지금 사|사야 할" README.md docs automation reports templates data
```

Expected:

```text
투자 추천 위험 표현이 실제 권유 문장으로 남아 있지 않다.
예시나 차단 규칙 안에서만 등장한다.
```

- [ ] **Step 2: 변경 파일을 확인한다**

Run:

```powershell
git status -sb
git diff --stat
```

Expected:

```text
계획된 파일만 변경되어 있다.
원하지 않는 임시 파일이 없다.
```

- [ ] **Step 3: 최종 커밋 후 push한다**

Run:

```powershell
git add README.md docs automation templates data reports
git commit -m "feat: implement weekly lab automation foundation"
git push origin main
```

- [ ] **Step 4: 사용자에게 실행 안내를 제공한다**

안내에는 아래를 포함한다.

```text
1. 어떤 파일이 바뀌었는지
2. Google Apps Script에 어떤 파일을 반영해야 하는지
3. setupSsmkWorkbook() 실행 후 무엇을 확인해야 하는지
4. SSMK Control Center를 어디서 여는지
5. 화요일 자동화는 어떤 방식으로 켜는지
6. 나머지 자동화가 왜 OFF인지
7. 문제가 나면 어떤 로그 탭을 보면 되는지
```

---

## 3. 검증 기준

구현이 끝났다고 판단하려면 아래 조건을 모두 만족해야 한다.

- `setupSsmkWorkbook()` 실행으로 새 탭과 헤더가 자동 생성된다.
- `user_preferences`에서 리포트 깊이, 가설 개수, 리뷰 반복 수를 바꿀 수 있다.
- `automation_schedules`에서 화요일 Weekly Lab만 ON이고 나머지는 OFF다.
- `SSMK Control Center` 사이드바가 열린다.
- 재작업 요청이 `revision_requests`에 저장된다.
- 리포트 섹션과 버전 이력이 `report_sections`, `report_versions`에 남는다.
- 모든 실행은 `automation_run_log`, `automation_step_log`에 기록된다.
- 오류는 `error_log`, 병목은 `bottleneck_log`, 최종 공정 평가는 `qa_review_log`에 남는다.
- 리포트 템플릿은 시각화, 핵심 가설 5개, Forecast vs Actual, 배당/ETF 코너를 포함한다.
- 추가 과금 API 호출 코드가 없다.
- 이메일 자동 발송은 OFF다.
- 민감 명칭 직접 언급이 남아 있지 않다.

## 4. 실행 방식 선택지

Plan complete and saved to `docs/superpowers/plans/2026-04-23-ssmk-weekly-lab-implementation.md`. Two execution options:

1. **Subagent-Driven (recommended)** - 작업 단위별로 독립 작업자를 배정하고, 각 작업 후 리뷰를 거쳐 다음 작업으로 넘어간다.
2. **Inline Execution** - 이 대화에서 내가 순서대로 직접 실행하고, 큰 단계마다 사용자에게 체크포인트를 보고한다.

이 프로젝트는 콘텐츠 품질, 데이터 구조, 자동화 안정성이 모두 중요하므로 1번 방식을 권장한다. 다만 현재 세션에서 실제 subagent 실행 권한이 제한될 경우, 2번 방식으로 동일한 task 순서를 따라 구현한다.
