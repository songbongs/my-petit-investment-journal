# Weekly Lab 운영 런북

이 문서는 SSMK Weekly Lab을 실제로 운영하거나 테스트할 때 참고하는 공개용 런북이다.

개인 Google Sheets 링크, Drive 링크, Notion 링크, 실제 예약 ID, 개인 Obsidian 경로 등은 이 문서에 적지 않는다. 그런 정보는 로컬 전용 `docs/private/` 문서에서 관리한다.

## 1. 이 런북의 역할

README는 프로젝트 소개와 철학을 설명한다. 이 문서는 실제 운영 순서와 문제 확인 절차를 설명한다.

대상:

- 프로젝트 유지보수자
- 다음 작업을 이어받는 AI/개발자
- Apps Script 코드를 실제 Google Sheets에 반영하는 운영자

## 2. 기본 원칙

1. 이메일 자동 발송은 기본 OFF다.
2. 외부 발송은 사용자 승인 후에만 진행한다.
3. 자동화 생성/수정/삭제는 중요한 운영 변경이므로 별도 승인 후 진행한다.
4. 점수와 가설은 투자 판단이 아니라 학습용 관찰 도구다.
5. 데이터가 부족하면 부족하다고 표시한다.

## 3. Apps Script에 반영해야 하는 파일

Google Apps Script 편집기에 반영하는 파일은 아래 3개다.

```text
automation/Code.gs
automation/SettingsSidebar.html
automation/appsscript.json
```

Markdown 문서들은 설명서와 기준 문서이므로 Apps Script 편집기에 붙여 넣는 대상이 아니다.

`automation/appsscript.json`은 Apps Script 실행 시간대, V8 런타임, 원격 실행 API, 필요한 Google 권한 범위를 보관한다.
코드만 바꾸고 이 파일을 빼먹으면 `clasp run` 같은 운영 점검이 막힐 수 있다.

## 4. 처음 한 번 실행할 함수

새로운 Google Sheets 또는 구조가 바뀐 Sheets에서는 아래 순서로 실행한다.

```text
showSsmkSetupBuild()
→ setupSsmkWorkbook()
→ applyWeeklyScoreFormulas()
→ applySsmkWorkbookDropdowns() 선택
```

각 함수의 의미:

| 함수 | 역할 |
|---|---|
| `showSsmkSetupBuild()` | 현재 Apps Script에 최신 코드가 반영됐는지 확인 |
| `setupSsmkWorkbook()` | 필요한 시트와 기본 구조 생성/보정 |
| `applyWeeklyScoreFormulas()` | `weekly_scores` 수식 보강 |
| `applySsmkWorkbookDropdowns()` | 입력 편의용 드롭다운 보강 |

`applySsmkWorkbookDropdowns()`는 핵심 실행 흐름에는 필수는 아니며, 입력 편의를 위한 선택 helper다.

## 5. 리포트 목차와 기준을 바꾸는 곳

Weekly Lab 리포트의 실행용 목차는 Google Sheets의 `report_blueprint` 탭에서 관리한다.

초보자용으로 말하면:

```text
templates/weekly-report-template.md = 사람이 읽는 설계도
report_blueprint = Apps Script가 실제 실행 때 읽는 목차표
```

`report_blueprint`에서 바꿀 수 있는 것:

- 섹션 제목
- 섹션 순서
- Docs 초안 포함 여부
- 이메일 HTML 포함 여부
- 필수 섹션 여부
- 섹션별 품질 기준 메모

단, `section_key`는 코드와 QA가 식별하는 고정 이름이므로 함부로 바꾸지 않는다.

기본으로 반드시 유지해야 하는 축:

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

데이터가 부족한 섹션은 바로 `needs_revision`으로 보지 않는다.
본문에 `부족한 데이터` 또는 `데이터 한계 표시됨`으로 정확히 적혀 있으면 정상 초안(`draft`)으로 둔다.
`needs_revision`은 본문이 비었거나 필수 섹션이 제대로 만들어지지 않은 경우처럼, 실제 재작성이 필요한 때에만 사용한다.

## 6. 정기 실행 일정이 정해지는 곳

실행 요일과 시간은 코드에 고정된 값이 아니라 `user_preferences`와 `automation_schedules` 설정을 따른다.

예를 들어 현재 값이 화요일 08:00이라면 "매주 화요일 08:00"으로 표시되지만, 나중에 수요일 09:00으로 바꿀 수 있다.

Apps Script 안에서는 새 기본 키인 `weekly_lab_primary_schedule`을 먼저 읽고, 기존 실행 호환을 위해 `tuesday_weekly_report` 키는 예비 경로로 남긴다.

## 7. SSMK Control Center 여는 법

Google Sheets 상단 메뉴에서 아래 항목을 연다.

```text
SSMK 자동화
→ 설정 열기: SSMK Control Center
```

Control Center에서 할 수 있는 일:

- 리포트 기본 설정 확인
- 자동화 스케줄 정책 확인
- 재작업 요청 입력
- 운영 상태 확인
- 강제 실행/재시작 실행
- 이메일용 HTML 검토본 생성

## 8. Weekly Lab 초안 준비 실행

기본 실행 메뉴:

```text
SSMK 자동화
→ 0. Weekly Lab 초안 준비 전체 실행
```

이 버튼이 하는 일:

- 시트 구조 점검
- `weekly_scores` 수식 확인
- 추천처럼 읽히는 문장 순화
- Google Docs용 Weekly Lab 입력 초안 생성
- 가설 복기 예약 기록
- 에이전트 리뷰 보드 실행
- 준비도/QA 로그 기록

이 버튼이 하지 않는 일:

- 이메일 발송
- 예약 자동화 생성/수정/삭제
- 중요한 운영 규칙 변경

## 9. 전체 사이클 실행과 재시작

Control Center에는 전체 사이클 실행과 재시작 흐름이 있다.

```text
오늘 전체 사이클 실행
처음부터 다시 실행
```

의미:

| 버튼 | 의미 |
|---|---|
| 오늘 전체 사이클 실행 | 오늘 기준 기존 작업 흔적이 있으면 이어서 진행 |
| 처음부터 다시 실행 | 오늘 기준 작업 재료를 지우고 다시 생성 |

재시작 시에도 운영 감사 이력은 남긴다.

남기는 것:

- `automation_run_log`
- `automation_step_log`
- `report_runs`
- `report_sections`
- `report_versions`
- `qa_review_log`
- Google Docs/Drive 파일

다시 만드는 작업 재료 예:

- `market_data`
- `news_events`
- `weekly_scores`
- `sector_theme_scores`
- `visualization_queue`
- `hypothesis_reviews`

## 10. 이메일용 HTML 검토본과 실제 발송

현재 Weekly Lab 전체 사이클은 발송용 최종 이메일을 바로 보내지 않고, Google Docs 보고서 초안과 이메일 검토용 HTML을 만든다.

실제 발송은 승인 상태일 때만 가능하도록 유지한다.

```text
HTML 검토본 생성 ≠ 실제 이메일 발송
```

실제 발송 전 확인할 것:

1. 문장이 투자 추천처럼 읽히지 않는가?
2. 데이터 출처와 한계가 분명한가?
3. Dividend & ETF Corner가 누락되지 않았는가?
4. Forecast vs Actual 또는 복기 흐름이 누락되지 않았는가?
5. 운영 로그나 QA 문구가 독자용 HTML에 들어가지 않았는가?

## 11. 문제가 생기면 확인할 탭

문제가 생기면 아래 순서로 확인한다.

```text
automation_run_log
→ automation_step_log
→ error_log
→ bottleneck_log
→ qa_review_log
→ report_sections
→ report_versions
→ revision_requests
```

짧게 기억하면:

```text
전체 흐름은 automation_run_log
단계별 멈춤은 automation_step_log
에러 문장은 error_log
최종 검사표는 qa_review_log
```

`qa_review_log.overall_status`가 `warning`이어도 항상 실패는 아니다.
예를 들어 데이터 신뢰도 낮음 항목 1개, 일부 보강 필요 데이터처럼 한계가 본문에 표시된 경우에는 발행 전 사람이 확인할 경고로 남기고, 자동화 구조 자체는 정상으로 볼 수 있다.

## 12. 현재 남은 운영 과제

대표 후속 과제:

1. 로그 helper의 중복 시트 구조 점검을 줄여 성능 하드닝하기
2. `applySsmkWorkbookDropdowns()` live 검증하기
3. 예약 실행 후 `market_data`, `weekly_scores`, `report_runs`, `report_versions`, `automation_run_log`, `qa_review_log`가 모두 쌓이는지 확인하기
4. 승인 상태일 때만 이메일 발송되도록 테스트하기
5. 4주 동안 AI 자동 초안 리포트를 운영하며 가설과 실제 결과 비교하기

## 13. 관련 문서

- `docs/SSMK-WEEKLY-LAB-SOUL.md`
- `docs/2026-04-24-next-ai-handoff.md`
- `docs/2026-04-30-codex-automation-setup-review.md`
- `docs/2026-05-02-github-candidate-research-handoff.md`
- `automation/google-apps-script-plan.md`
- `automation/ai-report-generation-workflow.md`
