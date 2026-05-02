# SSMK 투자 관찰노트

> 최우선으로 읽을 문서: [SSMK Weekly Lab Soul](docs/SSMK-WEEKLY-LAB-SOUL.md)
>
> 보고서, 자동화, Google Sheets, Apps Script, 이메일 HTML, 대시보드를 수정하기 전에는 이 문서를 먼저 확인합니다. 이 문서는 SSMK Weekly Lab이 투자 추천 서비스가 아니라 투자 공부용 관찰 시스템이라는 방향성을 지키기 위한 기준 문서입니다.

SSMK 투자 관찰노트는 미국주식을 바로 사고팔기 위한 추천 리스트가 아니라, 좋은 기업과 좋은 산업을 매주 같은 기준으로 관찰하고 기록하기 위한 투자 공부 프로젝트입니다.

이 프로젝트의 목표는 다음 질문을 반복해서 던지는 습관을 만드는 것입니다.

- 이 회사는 무엇으로 돈을 버는가?
- 그 돈벌이는 앞으로 커질 산업 안에 있는가?
- 경쟁사보다 강한 이유가 있는가?
- 매출, 이익, EPS, 현금흐름은 함께 좋아지고 있는가?
- 배당과 자사주 매입은 지속 가능한가?
- 내부자는 이 회사를 사고 있는가?
- 지금 가격은 기다릴 구간인가, 관심을 가질 구간인가?
- 이번 주 점수 변화는 기업의 본질 변화 때문인가, 단기 주가 변동 때문인가?

## 프로젝트 원칙

1. 투자 권유가 아니라 투자 공부 기록으로 운영한다.
2. 점수는 정답이 아니라 관찰을 돕는 도구로 사용한다.
3. 매주 같은 기준으로 기록해서 시간에 따른 변화를 본다.
4. AI는 데이터 수집, 가설 생성, 초보자용 해석, 리포트 초안, 지난 가설 복기까지 돕는다.
5. 사람은 투자 전문가 역할이 아니라 첫 번째 학습자이자 편집장으로 질문하고 발송을 승인한다.
6. AI가 다음 자동화 단계나 중요한 변경이 필요하다고 판단하면 근거를 설명하고 사용자 승인을 요청한다.
7. 월간 리뷰를 통해 맞은 판단보다 틀린 판단을 더 중요하게 복기한다.

## 현재 권장 운영 방식

초기에는 비용이 들지 않는 무료 도구 중심으로 운영합니다.

- Google Sheets: 점수 계산표, 워치리스트, 데이터 저장소
- Google Apps Script: 시트 구조 점검, SSMK Control Center, Weekly Lab 초안 준비, 로그 기록
- Gmail: 승인 후 단계에서만 연결할 발송 채널
- Google Drive: 승인 후 발송본 또는 초안 보관에 사용할 후보 저장소
- Notion: 종목과 산업 리서치 노트
- 선택 사항: GitHub Pages 또는 로컬 HTML 대시보드

## 폴더 구조

```text
SSMK-investment-journal/
├─ README.md
├─ AGENTS.md
├─ docs/
│  ├─ SSMK-WEEKLY-LAB-SOUL.md
│  ├─ 2026-04-22-project-philosophy-and-design.md
│  ├─ 2026-04-22-initial-workspace-setup.md
│  ├─ 2026-04-22-handoff-notes.md
│  ├─ 2026-04-22-automation-readiness-and-roadmap.md
│  ├─ 2026-04-22-google-sheets-codegs-update.md
│  ├─ ai-assisted-learning-architecture.md
│  └─ score-model-v1.md
├─ reports/
├─ data/
│  ├─ sample-score-table.csv
│  ├─ sample-hypothesis-review-table.csv
│  ├─ sample-automation-stage-review-table.csv
│  ├─ sample-change-approval-log.csv
│  └─ sample-agent-review-log.csv
├─ automation/
│  ├─ google-sheets-structure-plan.md
│  ├─ ai-report-generation-workflow.md
│  ├─ ai-prompt-weekly-report.md
│  ├─ ai-prompt-hypothesis-review.md
│  ├─ ai-agent-roles-and-review-board.md
│  ├─ automation-evolution-approval-gate.md
│  ├─ codex-weekly-lab-automation-prompt.md
│  ├─ codex-revision-request-prompt.md
│  ├─ google-apps-script-plan.md
│  ├─ SettingsSidebar.html
│  └─ Code.gs
└─ templates/
```

각 폴더의 역할은 다음과 같습니다.

- `docs`: 프로젝트 설계, 운영 철학, 의사결정 기록
- `reports`: 주간 리포트와 월간 리뷰 결과물
- `data`: 점수표, 원본 데이터, CSV 파일
- `automation`: 자동화 스크립트와 실행 설정
- `templates`: 뉴스레터, PDF, 종목 카드 템플릿

## 2026-04-23 현재 Weekly Lab 사용 순서

이 섹션은 "지금 당장 무엇을 누르면 되는지"를 초보자 기준으로 정리한 짧은 런북입니다.

### 1. 이번 단계에서 핵심으로 바뀐 파일

- `automation/Code.gs`: 메뉴, 시트 구조 점검, Weekly Lab workflow, 실행 로그
- `automation/SettingsSidebar.html`: `SSMK Control Center` 사이드바 화면
- `automation/codex-weekly-lab-automation-prompt.md`: Weekly Lab 초안 준비용 기준 프롬프트
- `automation/codex-revision-request-prompt.md`: 재작업 요청 처리 기준 프롬프트
- `templates/weekly-report-template.md`: Weekly Lab 12섹션 템플릿
- `automation/ai-report-generation-workflow.md`, `automation/google-apps-script-plan.md`, `automation/automation-evolution-approval-gate.md`: 현재 범위와 승인 게이트 설명

### 2. Google Apps Script에 직접 반영해야 하는 파일

직접 Apps Script 편집기에 넣어야 하는 파일은 아래 2개입니다.

- `automation/Code.gs`
- `automation/SettingsSidebar.html`

나머지 Markdown 문서들은 "설명서와 기준 문서"라서 Apps Script 편집기에 붙여 넣는 대상은 아닙니다.

### 3. 처음 한 번 해야 하는 일

가장 먼저 할 일은 시트 구조를 현재 코드 기준으로 맞추는 것입니다.

순서:

1. Google Sheets를 엽니다.
2. Apps Script 편집기에서 최신 `Code.gs`와 `SettingsSidebar.html`을 반영합니다.
3. 문제 해결이나 버전 확인이 필요하면 `showSsmkSetupBuild()`를 먼저 실행해서 최신 build가 보이는지 확인합니다.
4. 함수 목록에서 `setupSsmkWorkbook()`를 한 번 실행합니다.
5. 함수 목록에서 `applyWeeklyScoreFormulas()`를 한 번 실행합니다.
6. 드롭다운이 바로 필요하면 `applySsmkWorkbookDropdowns()`를 추가로 실행합니다. 이 단계는 선택 사항입니다.
7. 실행 후 아래 탭이 생겼는지 확인합니다.

확인할 대표 탭:

- `user_preferences`
- `automation_schedules`
- `report_runs`
- `report_sections`
- `report_versions`
- `revision_requests`
- `automation_run_log`
- `automation_step_log`
- `error_log`
- `bottleneck_log`
- `qa_review_log`

추가 확인:

- `automation_schedules`에서 `tuesday_weekly_report`만 `ON`인지 확인합니다.
- 나머지 스케줄은 `OFF`인지 확인합니다.
- `weekly_scores`의 총점/관찰 등급 수식이 정상인지 확인합니다.
- 드롭다운은 `applySsmkWorkbookDropdowns()` 실행 뒤 보이면 정상입니다.

### 4. SSMK Control Center 여는 법

Google Sheets 상단 메뉴에서 아래 순서로 엽니다.

```text
SSMK 자동화
→ 설정 열기: SSMK Control Center
```

여기서 할 수 있는 일:

- 리포트 깊이, 가설 개수, 리뷰 반복 수 같은 기본 설정 확인
- 재작업 요청 입력
- 스케줄 정책 상태 확인
- 메뉴의 `1-0`, `1-1`, `1-2` 항목으로 build 확인, 수식 보강, 드롭다운 보강을 따로 실행

### 5. 지금 Weekly Lab 초안 준비를 실행하는 법

현재 기본 실행 버튼은 아래 메뉴입니다.

```text
SSMK 자동화
→ 0. Weekly Lab 초안 준비 전체 실행
```

이 버튼이 하는 일:

- 시트 구조를 조용히 다시 점검
- `weekly_scores` 수식을 다시 확인
- 추천처럼 읽히는 문장을 자동 순화
- Google Docs용 Weekly Lab 입력 초안 생성
- 가설 복기 예약 기록
- 에이전트 리뷰 보드 실행
- 준비도/QA 로그 기록

이 버튼이 아직 하지 않는 일:

- 이메일 발송
- 예약 자동화 생성/수정/삭제
- 중요한 운영 규칙 변경
- 입력용 드롭다운 전체 보강

예전 방식이 필요하면 아래 레거시 메뉴를 비교용으로만 씁니다.

```text
SSMK 자동화
→ 0-legacy. 이전 주간 초안 준비 실행
```

### 6. 화요일 자동화는 어떻게 켜져 있는가

지금은 두 단계를 분리해서 이해하면 쉽습니다.

1단계: 시트 정책

- `automation_schedules` 탭에서 `tuesday_weekly_report`는 기본 `ON`입니다.
- 이 값은 "화요일 Weekly Lab만 현재 운영 대상"이라는 뜻입니다.

2단계: 실제 예약 실행

- 2026-04-30에 사용자 승인 후 Codex 예약 자동화를 생성했습니다.
- 예약 이름은 `SSMK Weekly Lab draft automation`입니다.
- 예약 ID는 `ssmk-weekly-lab-draft-automation`입니다.
- 실행 시점은 매주 화요일 오전 8시, Asia/Seoul 기준입니다.
- 이 예약은 이메일 발송을 하지 않고, Google Sheets/Docs 초안 생성과 로그 기록까지만 수행합니다.
- 문제가 생기면 Codex 예약을 잠시 멈춘 뒤 `automation_run_log`, `automation_step_log`, `error_log`, `qa_review_log`를 순서대로 확인합니다.

3단계: Google Apps Script 자체 예약

- 장기 운영의 주 실행 엔진은 Apps Script 자체 트리거로 두는 방향으로 보강했습니다.
- `SSMK Control Center`에서 요일/시간을 저장한 뒤 `Apps Script 예약 적용`을 누르면 `scheduledWeeklyLabTrigger()` 예약이 만들어집니다.
- 2026-04-30 보강 후 이 예약은 `runWeeklyLabFullCycle()`을 실행합니다.
- 즉, watchlist 기준 1차 가격/거래량 자료 생성, Google News RSS 뉴스 후보 수집, `market_data`/`news_events` 기록, `weekly_scores` 생성, 스코어링 값 저장 검증, 자동 시각화 큐 생성, Google Docs 보고서 초안 생성, 이메일용 HTML 최종본 생성, QA 로그까지 한 번에 진행합니다.
- 같은 날짜의 완료 리포트가 이미 있으면 중복 실행하지 않고 `skipped`로 남깁니다. 중간에 멈춘 흔적만 있으면 기본값은 이어가기입니다.
- Codex 예약 자동화는 주 실행 엔진보다 실행 후 점검, 설명, 보조 실행 역할로 쓰는 편이 안전합니다.

4단계: 강제 실행과 재시작

- `오늘 전체 사이클 실행`: 오늘 기준 작업을 이어서 실행합니다. 이미 일부 자료가 있으면 재사용하고, 빠진 부분만 채우는 기본 모드입니다.
- `처음부터 다시 실행`: 오늘 기준 `market_data`, `news_events`, `weekly_scores`, `sector_theme_scores`, `visualization_queue`, `hypothesis_reviews` 작업 행을 지우고 다시 만듭니다. 같은 날 작업이 꼬였을 때만 사용합니다.
- 기존 `automation_run_log`, `automation_step_log`, `report_runs`, `report_sections`, `report_versions`, `qa_review_log`, Google Docs/Drive 파일은 감사 이력으로 남깁니다. 쉽게 말해 "작업 재료"는 새로 만들고, "이전에 무엇을 했는지 보여주는 영수증"은 남기는 구조입니다.
- `SSMK Control Center`의 `운영 홈`에서 운영 판정, 마지막 실행 상태, 단계별 경고/실패 수, 에러 로그 수, 자동 시각화 수, QA 다음 액션을 한곳에서 봅니다.

### 6-1. 이메일용 최종본은 어떻게 보는가

현재 Weekly Lab 전체 사이클은 발송용 최종 이메일을 바로 보내지 않고, Google Docs 보고서 초안과 이메일 검토용 HTML 최종본을 만듭니다.

이메일로 깔끔하게 받으려면 다음 단계를 분리해서 봅니다.

1. `runWeeklyLabFullCycle()`이 자료 생성, 시트 기록, 스코어링, Google Docs 초안, HTML 최종본, 로그를 만듭니다.
2. 사용자가 초안을 읽고 재작업 요청 또는 승인을 결정합니다.
3. `SSMK Control Center`에서 report_id를 넣고 `이메일용 HTML 최종본 만들기`를 누릅니다.
4. Google Drive에 `.html` 파일이 생성되고 `report_versions`에 새 버전으로 기록됩니다.
5. 실제 발송은 `report_runs.generation_status`가 `승인`일 때만 `sendApprovedReport(reportId)`로 가능합니다.

`email_auto_send`는 계속 `OFF`가 기본값입니다. 즉, HTML 최종본을 만드는 것과 실제 이메일 발송은 다른 단계입니다.

### 7. 나머지 자동화가 왜 OFF인가

나머지 자동화가 `OFF`인 이유는 "안 해서"가 아니라 "아직 안정성을 더 확인해야 해서"입니다.

- 수요일 재작업 자동 반영: 섹션 범위와 버전 이력 연결이 더 안정적인지 보고 켜야 합니다.
- 월말 가설 복기 자동화: 실제 결과 비교 흐름이 누락 없이 쌓이는지 먼저 봐야 합니다.
- 이메일/외부 발송 자동화: 잘못된 내용이 밖으로 나가면 되돌리기 어렵기 때문에 승인 게이트를 유지합니다.
- 자동화 생성/수정/삭제: 운영 방식 자체가 바뀌는 일이므로 앞으로도 제안서와 승인 후에만 진행합니다.

### 8. 문제가 나면 어디를 보면 되는가

문제가 생기면 아래 탭을 순서대로 보면 됩니다.

- `automation_run_log`: 이번 실행이 전체적으로 시작됐는지, 끝났는지
- `automation_step_log`: 어느 단계까지 성공했고 어디서 멈췄는지
- `error_log`: 실제 에러 메시지가 무엇인지
- `bottleneck_log`: 시간이 오래 걸리거나 막힌 구간이 있는지
- `qa_review_log`: 마지막 품질 점검 결과가 어떤 상태인지
- `report_sections`: 어느 섹션이 `needs_revision`인지
- `report_versions`: 어떤 버전이 언제 만들어졌는지
- `revision_requests`: 사용자가 남긴 재작업 요청이 처리 대기인지

초보자용으로 아주 짧게 기억하면:

```text
전체 흐름은 automation_run_log,
단계별 멈춤은 automation_step_log,
에러 문장은 error_log,
최종 검사표는 qa_review_log를 보면 됩니다.
```

### 9. 2026-04-24 기준 실제 검증 결과

현재 구현은 문서 설계만 끝난 상태가 아니라, 실제 Google Sheets와 bound Apps Script에서도 1회 끝까지 실행 확인을 마친 상태입니다.

- `showSsmkSetupBuild()` 성공
- `setupSsmkWorkbook()` 성공
- `applyWeeklyScoreFormulas()` 성공
- `runWeeklyLabWorkflow()` 성공
- 생성 확인:
  - `automation_run_log`
  - `report_runs`
  - Google Docs 입력 초안 1건
- 실행 로그 기준 최종 상태:
  - `초안 생성`
  - `에이전트 차단 항목: 0개`
  - `자동화 준비도 점수: 90`
- 이후 watchlist 분류 기준 보강도 실제 Google Sheets에 반영 및 재확인 완료:
  - `watchlist!C2:G21` 분류 업데이트
  - 20개 초기 종목의 `theme_tags`, `investment_style` 입력 완료
  - MSFT는 `AI/클라우드/반도체 인프라`로 정리하고, 게임 노출은 `theme_tags`에 보존
  - bound Apps Script에서 `showSsmkSetupBuild()` 실행 결과 `2026-04-24-watchlist-classification-v1` 확인

## 다음 작업 후보

1. 실제 Google Sheets에 `automation/google-sheets-structure-plan.md` 기준으로 컬럼 추가하기: 완료
2. `automation/Code.gs` 초안 만들기: 완료
3. Google Sheets 샘플/실데이터 기준 `runWeeklyLabWorkflow()` 수동 실행 테스트하기: 완료
4. `agent_review_log`, `automation_stage_reviews`, `change_approval_log` 탭 반영하기: 완료
5. watchlist 부분 마이그레이션 안전화 및 분류 기준 반영하기: 완료
6. `runWeeklyLabFullCycle()` 전체 파이프라인 추가: 완료
7. 로그 helper의 중복 시트 구조 점검을 줄여 성능 하드닝하기
8. `applySsmkWorkbookDropdowns()` live 검증하기
9. 다음 화요일 예약 실행 후 `market_data`, `weekly_scores`, `report_runs`, `report_versions`, `automation_run_log`, `qa_review_log`가 모두 쌓이는지 확인하기
10. 승인 상태일 때만 이메일 발송되도록 테스트하기
11. 실제 예약 자동화는 2026-04-30에 1차 생성 완료. 다음 변경부터는 승인 게이트 문서 확인 후 따로 제안서 만들기
12. 4주 동안 AI 자동 초안 리포트를 운영하며 가설과 실제 결과를 비교하기

## 점수 표현 방식

SSMK 점수는 기존처럼 10점 만점 숫자를 유지합니다. 다만 숫자만 있으면 초보자가 정답처럼 받아들일 수 있으므로, 앞으로는 `관찰 등급`과 `데이터 신뢰도`를 함께 표시합니다.

| 항목 | 의미 | 예시 |
|---|---|---|
| SSMK 점수 | 10점 만점의 관찰 점수 | `8.4` |
| 관찰 등급 | 점수를 쉬운 말로 다시 표현 | `높음 / 중간 / 낮음` |
| 데이터 신뢰도 | 사용한 자료를 얼마나 믿을 수 있는지 | `높음 / 중간 / 낮음` |

예시:

```text
SSMK 점수: 8.4
관찰 등급: 높음
데이터 신뢰도: 중간
해석: 이번 주 공부 우선순위는 높지만, 최신 공식 자료 확인 전까지 투자 판단으로 쓰지 않는다.
```

기본 등급 기준:

| SSMK 점수 | 관찰 등급 |
|---:|---|
| 8.0~10.0 | 높음 |
| 6.0~7.9 | 중간 |
| 0.0~5.9 | 낮음 |

중요:

```text
높음 = 좋은 투자 대상이라는 뜻이 아닙니다.
높음 = 이번 주에 더 먼저 공부할 이유가 있다는 뜻입니다.
```

## 연결된 작업공간

- Google Sheets 점수표: https://docs.google.com/spreadsheets/d/121yVeU20KkZ2szGFGPNq7H8KdLSgDgLy5y0naGzRFsA/edit
- Notion 프로젝트 허브: https://www.notion.so/34163ad6fcc6808fbc5ac2e8b5721979
- Google Drive 폴더: `G:\내 드라이브\[AI Project]\SSMK-investment-journal`

## 자동화 준비 원칙

자동화는 단순 반복을 줄이는 수준에 머무르지 않고, 사용자가 시장을 배우는 과정을 돕는 방향으로 설계합니다. AI가 데이터 수집, 점수 계산, 가설 생성, 초보자용 해석, 리포트 초안, 지난 가설 복기 초안까지 담당하고, 사람은 첫 번째 학습자로서 질문하고 최종 발송을 승인합니다.

자세한 방향은 [AI 보조 학습형 아키텍처](docs/ai-assisted-learning-architecture.md)와 [자동화 준비도와 발전 로드맵](docs/2026-04-22-automation-readiness-and-roadmap.md)을 기준으로 관리합니다.

```text
AI 자동 초안 4주 운영 → 가설/근거/실제 결과 비교 → 안정 데이터 수집 자동화 확대 → 사람 발송 승인
```

자동화 발전도 같은 방식으로 승인 게이트를 둡니다.

```text
AI 품질 자가검증 → 발전 단계 제안 → 사용자 승인/보류/거절 → 승인된 변경만 적용
```

AI가 "이제 다음 단계로 넘어가도 좋겠다"고 판단해도 조용히 적용하지 않습니다. 반드시 현재 상태, 판단 근거, 기대 효과, 위험, 되돌리는 방법을 설명하고 사용자 승인을 요청합니다.

가설은 반드시 아래 구조로 작성합니다.

```text
가설 요약
→ 근거 지표/데이터
→ 이 지표/데이터를 보고 왜 그렇게 예상했나
→ 초보자가 배울 포인트
→ 한계와 다음 확인
```

예를 들어 "클라우드 매출이 좋아서 Microsoft가 좋아 보인다"라고 쓰지 않습니다. 대신 "클라우드 매출 성장률은 기업 고객의 AI/데이터 인프라 지출 강도를 보여주는 지표이고, 이 성장률이 유지되면 Microsoft의 반복 매출과 마진 방어력이 유지될 가능성이 있다. 다만 AI 투자가 실제 이익률로 이어지는지는 다음 실적에서 확인해야 한다"처럼 근거와 해석 과정을 함께 적습니다.

## 초기 워치리스트

이 워치리스트는 매수 추천 목록이 아니라, 산업별 흐름과 기업 지표를 공부하기 위한 관찰 후보입니다.

앞으로는 `산업`, `테마`, `투자 성격`을 나누어 기록합니다.

```text
산업 = 이 회사가 실제로 돈을 버는 본업
테마 = 지금 시장이 관심 갖는 큰 흐름
투자 성격 = 이 회사를 어떤 관점으로 공부할지
```

월간 리뷰에서는 아래 7개 산업 구분을 기본으로 사용합니다.

| 핵심 산업 | 관찰 종목 | 대표 테마 태그 | 대표 투자 성격 |
|---|---|---|---|
| AI/클라우드/반도체 인프라 | MSFT, NVDA, QCOM, AAPL | AI, 클라우드, 반도체, 온디바이스 AI | 성장주, 혼합 |
| 디지털 플랫폼/광고 | GOOGL, META, TTD | 광고, 플랫폼, AI 광고 도구 | 성장주, 플랫폼 |
| 미디어/게임/콘텐츠 | NFLX, DIS, TTWO | 스트리밍, 콘텐츠, 게임, 턴어라운드 | 성장주, 턴어라운드 |
| 자동차/전기차 | TSLA, GM | 전기차, 자율주행, 가격 경쟁 | 성장주, 경기민감, 턴어라운드 |
| 헬스케어/제약 | JNJ, LLY, MRK | 신약, 파이프라인, 방어주, 배당 | 방어주, 배당주, 성장주 |
| 에너지/산업소재 | XOM, CVX, LIN | 유가, 현금흐름, 산업용 가스, 배당 | 배당주, 경기민감 |
| 글로벌 소비재/럭셔리 | EL, LVMUY | 중국 소비, 브랜드 파워, 럭셔리, 마진 | 소비재, 턴어라운드 |

예를 들어 MSFT는 `AI/클라우드/반도체 인프라`에 넣되, 테마 태그에는 `AI`, `클라우드`, `게임`, `주주환원`을 함께 기록합니다. 이렇게 하면 월간 리뷰는 깔끔하게 유지하면서도, 여러 사업을 가진 기업을 한 칸에 억지로 가두지 않을 수 있습니다.

### watchlist 분류 기준 운영 규칙

`watchlist`의 분류는 AI가 초안을 만들 수 있지만, 최종 기준은 사용자가 편집장처럼 승인합니다. 이 분류는 투자 판단을 대신하는 신호가 아니라, Weekly Lab이 종목을 같은 기준으로 묶어 읽기 위한 공부용 라벨입니다.

운영 기준:

1. `core_industry`는 월간 리뷰용 큰 바구니라서 한 종목당 하나만 고릅니다.
2. 여러 사업을 가진 회사는 `theme_tags`에 보조 주제를 여러 개 넣습니다.
3. `investment_style`은 매수/매도 판단이 아니라 공부 관점을 적습니다.
4. `role_in_watchlist`는 "왜 이 종목을 관찰하는가"를 초보자가 이해할 수 있는 문장으로 적습니다.

좋은 예시:

| ticker | core_industry | theme_tags | investment_style | role_in_watchlist |
|---|---|---|---|---|
| MSFT | AI/클라우드/반도체 인프라 | AI, 클라우드, Azure, Microsoft 365, Copilot, 게임, Xbox/Activision, 주주환원 | 성장주, 혼합, 플랫폼 | Azure/Microsoft 365/Copilot 중심의 클라우드·AI 플랫폼. Xbox/Activision은 콘텐츠·구독 확장 사례로 함께 관찰 |

이 기준의 현재 20개 초기 워치리스트 초안은 `automation/Code.gs`의 `WATCHLIST_CLASSIFICATION_GUIDE`에 저장되어 있습니다. 새 AI가 분류를 다시 만들 때는 이 값을 좋은 예시로 보고, 종목의 실제 사업 비중과 관찰 목적이 바뀐 경우에만 근거를 남기고 수정합니다.
