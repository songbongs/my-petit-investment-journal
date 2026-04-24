# SSMK 투자 관찰노트 다음 AI 작업 인수인계서

작성일: 2026-04-24

## 1. 이 문서의 목적

이 문서는 다음 AI가 이 프로젝트를 처음 열었을 때, 현재 상태를 빠르게 파악하고 안전하게 후속 작업을 이어가기 위한 인수인계 기록이다.

초보자용으로 아주 짧게 요약하면:

```text
Weekly Lab 기반 Google Sheets + Apps Script 자동화의 "기초 골조"는 완성되었고,
실제 bound Apps Script에서도 1회 라이브 실행 검증까지 끝났다.
다음 단계는 "하드닝(debug/안전성 보강) → 운영 반복 검증 → 승인 기반 확장" 순서다.
```

## 2. 현재 프로젝트 기준점

작업 폴더:

```text
C:\Users\kblife\Documents\AI-Playground\SSMK-investment-journal
```

현재 브랜치:

```text
codex/weekly-lab-control-center
```

현재 PR:

```text
https://github.com/songbongs/my-petit-investment-journal/pull/1
```

PR 상태:

```text
ready for review
```

최신 기준 커밋:

```text
1bbe925 feat: add watchlist classification guide
```

현재 로컬 브랜치 상태:

```text
origin/codex/weekly-lab-control-center보다 앞서 있음. 정확한 ahead 수는 git status --short --branch로 확인.
```

## 3. 외부 작업공간

Google Sheets:

```text
SSMK 투자 관찰노트 - 점수표
https://docs.google.com/spreadsheets/d/121yVeU20KkZ2szGFGPNq7H8KdLSgDgLy5y0naGzRFsA/edit
```

최근 라이브 실행에서 생성된 Google Docs 입력 초안:

```text
https://docs.google.com/open?id=12vDrbqCuHIuCLG19lP500QSV-wjxJydEEjSQIlqFqPg
```

최근 라이브 실행 식별자:

```text
run_id: RUN-20260424-084822-588
report_id: RPT-20260422-30086
```

## 4. 프로젝트가 현재 어디까지 왔는가

현재 진행 단계를 쉬운 말로 나누면 아래와 같다.

### 단계 A. 철학/구조 설계

상태:

```text
완료
```

포함 내용:

- 투자 추천이 아닌 투자 공부용 관찰 기록이라는 철학 정리
- Weekly Lab 구조 설계
- 시트 스키마 설계
- 자동화 승인 게이트 원칙 정리
- AI 역할 분리와 리뷰 보드 설계

### 단계 B. Weekly Lab foundation 구현

상태:

```text
완료
```

포함 내용:

- `automation/Code.gs`
- `automation/SettingsSidebar.html`
- `templates/weekly-report-template.md`
- `automation/codex-weekly-lab-automation-prompt.md`
- `automation/codex-revision-request-prompt.md`
- 로그/버전/재작업/QA 구조
- `runWeeklyLabWorkflow()` 기본 흐름

### 단계 C. 실제 Google Sheets / bound Apps Script 연결 및 1회 라이브 검증

상태:

```text
완료
```

실제 확인된 것:

- `showSsmkSetupBuild()` 성공
- `setupSsmkWorkbook()` 성공
- `applyWeeklyScoreFormulas()` 성공
- `runWeeklyLabWorkflow()` 성공
- `automation_run_log` 업데이트 확인
- `report_runs` 업데이트 확인
- `error_log` 비어 있음 확인
- 최종 상태 `초안 생성`
- 준비도 점수 `90`

### 단계 D. 하드닝과 반복 운영 검증

상태:

```text
부분 완료
```

이미 한 것:

- setup timeout 원인 분석
- setup을 빠른 구조 점검과 helper 단계로 분리
- blocking alert 제거
- build 확인 helper 추가
- 드롭다운을 선택 단계로 분리
- watchlist 부분 마이그레이션 안전화
- 20개 초기 watchlist 분류 기준 live Google Sheets 반영
- bound Apps Script에서 `showSsmkSetupBuild()` 결과 `2026-04-24-watchlist-classification-v1` 확인

아직 남은 것:

- 로그 기록 성능 이슈 1건
- 드롭다운 helper live 실행 검증
- 2~4회 반복 운영 검증

### 단계 E. 승인 기반 운영 확장

상태:

```text
아직 시작 전
```

예시:

- 실제 예약 자동화 생성/수정
- 이메일 발송 연결
- 더 큰 운영 변경

이 단계는 사용자 승인 전에는 진행하지 않는다.

## 5. 현재 기본 실행 방식

현재 초보자 기준 운영 순서는 아래가 맞다.

```text
showSsmkSetupBuild()
→ setupSsmkWorkbook()
→ applyWeeklyScoreFormulas()
→ runWeeklyLabWorkflow()
```

선택 사항:

```text
applySsmkWorkbookDropdowns()
```

설명:

- `showSsmkSetupBuild()`는 최신 Code.gs가 Apps Script에 실제로 반영됐는지 확인하는 용도다.
- `setupSsmkWorkbook()`은 빠른 구조 점검/보정만 한다.
- `applyWeeklyScoreFormulas()`는 `weekly_scores` 수식 보강 helper다.
- `applySsmkWorkbookDropdowns()`는 입력 편의용 helper라서 지금 핵심 workflow에는 필수는 아니다.
- `runWeeklyLabWorkflow()`가 현재 기본 Weekly Lab 실행 경로다.

## 6. 지금 실제로 동작하는 범위

현재 구현은 아래까지 실제로 확인되었다.

- 시트 구조 점검/보정
- Control Center 설정 UI
- watchlist 분류 기준 반영
- revision request 기록
- report version 기록
- run / step / error / bottleneck / QA 로그
- Google Docs 입력 초안 생성
- agent review board 기록
- automation readiness 평가

현재 구현이 아직 하지 않는 일:

- 이메일 발송
- 실제 Codex 예약 자동화 생성/수정/삭제
- 승인 게이트를 넘는 운영 변경

## 7. 다음 AI가 먼저 읽어야 할 파일

우선순위 순서:

1. `README.md`
2. `docs/2026-04-24-next-ai-handoff.md`
3. `docs/2026-04-23-implementation-task-log.md`
4. `automation/Code.gs`
5. `automation/SettingsSidebar.html`
6. `automation/google-apps-script-plan.md`
7. `automation/ai-report-generation-workflow.md`

이유:

- `README.md`는 초보자 운영 흐름의 최신 요약이다.
- 이 인수인계 문서는 “어디까지 끝났고 다음에 뭘 해야 하는지”를 요약한다.
- implementation log는 작업 이력과 live verification 기록이 남아 있다.
- `Code.gs`가 실제 동작의 중심이다.

## 8. 현재 남아 있는 핵심 리스크

이 항목은 solo 프로젝트 기준 최종 점검에서 나온 실제 후속 작업 후보다.

### 리스크 1. watchlist 부분 마이그레이션 상태에서 데이터 밀림 가능성

위험도:

```text
P1
```

처리 상태:

```text
2026-04-24 처리 완료
```

문제 설명:

- `normalizeWatchlistColumns_()`는 `theme_tags` 또는 `investment_style` 둘 중 하나만 없어도 `insertColumnsAfter(3, 2)`를 실행한다.
- 그 다음 `setHeaders_()`는 헤더만 덮어쓴다.
- 그래서 `watchlist`가 완전 구버전이 아니라 "중간 migration 상태"이면 기존 데이터가 옆 칸으로 밀릴 수 있다.

쉽게 말한 예시:

```text
원래 D열에 있던 값이
새 구조 보정 후에는 E열이나 F열 의미로 밀릴 수 있다.
```

처리 내용:

1. `watchlist` 데이터를 기존 헤더 이름 기준으로 읽는다.
2. 새 표준 헤더 순서에 맞게 행 데이터를 다시 배치한다.
3. 빠진 컬럼은 빈칸으로 둔다.
4. `theme_tags`만 있거나 `investment_style`만 있는 중간 migration 상태를 stub test로 검증했다.
5. 20개 초기 watchlist의 `core_industry`, `theme_tags`, `investment_style`, `role_in_watchlist`, `tracking_priority`는 승인된 분류 기준으로 live Google Sheets에 반영했다.
6. 향후 분류 기준의 좋은 예시는 `automation/Code.gs`의 `WATCHLIST_CLASSIFICATION_GUIDE`와 `getWatchlistClassificationGuide()`를 먼저 확인한다.

### 리스크 2. 로그 1줄 쓸 때마다 전체 스키마 점검 반복

위험도:

```text
P2
```

문제 설명:

- `startAutomationRun_()`
- `finishAutomationRun_()`
- `logAutomationStep_()`
- `logError_()`
- `logBottleneck_()`

위 함수들이 각각 `ensureWorkbookSchemaSheets_(ss)`를 다시 호출한다.

이 함수는:

- 여러 시트를 다시 확인하고
- 그룹마다 `SpreadsheetApp.flush()`까지 수행한다.

지금은 1회 live run이 통과했지만, 실행 단계가 더 늘어나거나 시트가 커지면 다시 timeout 위험이 커질 수 있다.

권장 후속 작업:

1. "run 시작 전에 한 번만 ensure" 하는 방식으로 바꿀지 검토한다.
2. logging helper는 schema ensure를 생략하거나 최소화한다.
3. 적어도 run context 안에서는 중복 ensure를 막는 캐시/flag 방식을 고려한다.
4. 변경 후 live-safe 검증 또는 stub 검증을 다시 한다.

### 리스크 3. 드롭다운 helper는 아직 live 검증 미완료

위험도:

```text
P3
```

문제 설명:

- `applySsmkWorkbookDropdowns()`는 코드상으로는 분리되어 있지만 아직 실제 bound Apps Script에서 실행 검증을 끝내지 않았다.
- 핵심 workflow에는 필수가 아니라서 지금 당장 급하지는 않다.

권장 후속 작업:

1. live 시트에서 `applySsmkWorkbookDropdowns()`를 1회 실행
2. timeout 여부 확인
3. 대표 시트 2~3개에서 dropdown 노출 확인

## 9. 다음 작업을 어떤 순서로 하면 좋은가

추천 순서:

### 1순위. 재실행 안전성/성능 하드닝

작업 후보:

1. `normalizeWatchlistColumns_()` 안전화: 2026-04-24 완료
2. watchlist 분류 기준 반영 및 build 확인: 2026-04-24 완료
3. logging helper의 중복 schema ensure 축소
4. 관련 stub 검증 추가

이 단계가 중요한 이유:

```text
지금은 "한 번 성공"한 상태다.
다음 목표는 "다시 실행해도 안전"한 상태로 만드는 것이다.
```

### 2순위. 드롭다운 helper live 검증

작업 후보:

1. `applySsmkWorkbookDropdowns()` 실행
2. timeout/성능 확인
3. 대표 입력 탭에서 dropdown 노출 확인

### 3순위. 운영 반복 검증

작업 후보:

1. `runWeeklyLabWorkflow()`를 2~4회 추가로 운영
2. `automation_run_log`, `automation_step_log`, `qa_review_log` 패턴 확인
3. revision request와 report version 연결 검증

### 4순위. 승인 기반 확장 검토

이 단계는 사용자 승인 후에만 검토한다.

예시:

- 실제 예약 자동화 생성/수정
- 이메일 발송 연결
- 더 큰 운영 변경

## 10. 후속 작업 시 꼭 지켜야 하는 운영 규칙

다음 AI는 아래 원칙을 그대로 유지해야 한다.

1. 이메일 발송, 자동화 생성/수정/삭제, 중요한 운영 변경은 사용자 승인 전에는 하지 말 것
2. 투자 추천처럼 읽히는 표현을 피할 것
3. 비개발자 초보자도 따라갈 수 있도록 설명을 단계별로 쉽게 쓸 것
4. 솔로 프로젝트이므로 GitHub PR 코멘트보다 이 채팅에서의 리뷰/피드백 흐름을 우선할 것
5. PR은 리뷰 토론창보다 작업 기록과 검증 요약으로 활용할 것

## 11. 지금 상태를 아주 짧게 설명하면

```text
Weekly Lab foundation 구현 완료
→ 실제 Apps Script 1회 라이브 검증 완료
→ watchlist 안전화와 분류 기준 반영 완료
→ 다음은 로그 기록 성능 하드닝과 반복 운영 검증
```

## 12. 다음 AI를 위한 추천 작업 시작 절차

아래 순서로 시작하면 가장 안전하다.

1. `README.md` 읽기
2. 이 인수인계 문서 읽기
3. `docs/2026-04-23-implementation-task-log.md`의 2026-04-24 섹션 읽기
4. `automation/Code.gs`에서 아래 함수부터 확인:
   - `runWeeklyLabWorkflow()`
   - `setupSsmkWorkbook()`
   - `applyWeeklyScoreFormulas()`
   - `applySsmkWorkbookDropdowns()`
   - `normalizeWatchlistColumns_()`
   - `getWatchlistClassificationGuide()`
   - logging helper들
5. 남은 리스크 2부터 작은 단위로 수정
6. 문법 검증
7. 가능한 stub 검증
8. 작은 체크포인트 커밋
9. 사용자에게 쉬운 말로 무엇이 바뀌었는지 설명

## 13. 후속 작업 시 사용할 짧은 프롬프트

아래 프롬프트를 사용자가 다음 세션에서 그대로 붙여넣으면 된다.

### 기본 이어하기 프롬프트

```text
SSMK 투자 관찰노트 작업 이어서 해줘.
먼저 README.md, docs/2026-04-24-next-ai-handoff.md, docs/2026-04-23-implementation-task-log.md, automation/Code.gs를 읽고 현재 상태를 파악해줘.
그 다음 인수인계서의 남은 리스크 2, 즉 로그 helper의 중복 schema ensure를 줄이는 성능 하드닝부터 작은 단위로 진행해줘.
작업 방식은 항상 작업 → 검증 → 커밋 → 쉬운 설명 순서로 하고,
이메일 발송, 실제 예약 자동화 생성/수정, 중요한 운영 변경은 내 승인 전에는 하지 말아줘.
투자 추천처럼 읽히는 표현도 피해줘.
```

### 디버그 중심 프롬프트

```text
SSMK 투자 관찰노트 디버그 이어서 해줘.
docs/2026-04-24-next-ai-handoff.md의 리스크 2를 먼저 확인하고,
다른 기능에 영향이 가장 적은 방식으로 작은 수정부터 진행해줘.
수정 전에는 영향 범위를 설명하고, 수정 후에는 검증 결과를 쉬운 말로 알려줘.
```

### 운영 검증 중심 프롬프트

```text
SSMK 투자 관찰노트 운영 검증 이어서 해줘.
docs/2026-04-24-next-ai-handoff.md를 기준으로 현재 live-verified 상태를 먼저 요약하고,
applySsmkWorkbookDropdowns() live 검증이나 반복 운영 검증처럼 아직 남은 확인 작업을 작은 순서대로 진행해줘.
승인 필요한 작업은 먼저 물어봐줘.
```

## 14. 마지막 메모

이 프로젝트는 지금 "설계만 된 프로젝트"가 아니라,

```text
실제 Google Sheets + bound Apps Script + Google Docs 초안 생성까지
한 번 끝까지 실행이 확인된 상태
```

다음 AI의 일은 "처음부터 다시 만들기"가 아니라,

```text
이미 돌아가는 흐름을 더 안전하고, 더 반복 가능하게 만드는 것
```

에 가깝다.
