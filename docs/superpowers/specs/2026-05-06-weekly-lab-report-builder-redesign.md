# Weekly Lab Report Builder Redesign

작성일: 2026-05-06

## 1. 목적

이번 개선의 목적은 SSMK Weekly Lab 자동화가 예전 간이 초안 품질로 되돌아가지 않게 하는 것이다.

핵심 문제는 개선된 기준 문서와 템플릿은 존재하지만, 실제 예약 실행 경로가 그 기준을 읽거나 강제하지 않는다는 점이다. 따라서 이번 설계는 단순히 문장을 더 예쁘게 고치는 작업이 아니라, 아래 구조를 만드는 작업이다.

```text
설정/블루프린트
→ 데이터 컨텍스트
→ 섹션 모델
→ Docs 초안 렌더러
→ 이메일 HTML 렌더러
→ QA Gate
→ 최소 검증
```

초보자용으로 말하면:

```text
지금은 자동화가 예전 양식으로 바로 글을 써버린다.
앞으로는 먼저 "이번 리포트는 어떤 목차와 기준을 따라야 하는가"를 확인하고,
그 기준을 통과한 내용만 초안과 HTML로 조립하게 만든다.
```

## 2. 현재 문제 요약

### 2-1. 실제 예약 실행 경로가 개선 템플릿을 쓰지 않는다

현재 Apps Script 예약 실행은 아래 흐름을 탄다.

```text
scheduledWeeklyLabTrigger()
→ runWeeklyLabFullCycle()
→ createWeeklyLabDraftReportDoc_()
→ buildWeeklyLabDraftReportText_()
```

문제는 `buildWeeklyLabDraftReportText_()`가 `templates/weekly-report-template.md`나 `docs/SSMK-WEEKLY-LAB-SOUL.md`의 구조를 읽지 않고, 5개 섹션짜리 텍스트를 직접 만든다는 점이다.

그 결과 2026-05-05 초안에는 아래 개선 요소가 누락되었다.

- Market Map
- Industry & Theme Board
- SSMK Stock Dashboard
- SSMK Lens Deep Dive
- Dividend & ETF Corner
- Forecast vs Actual
- Hypothesis Evolution Log
- Agent Review Board

### 2-2. 나쁜 문장 패턴이 데이터 생성 단계에서 들어간다

`weekly_scores`를 만들 때 아래와 같은 문장이 기본 가설로 들어간다.

```text
OO은 이번 주 OO 지표를 통해 관찰 우선순위를 확인합니다.
```

이 문장은 `docs/SSMK-WEEKLY-LAB-SOUL.md`에서 명시적으로 피해야 할 예시와 같은 구조다.

좋은 문장은 아래 흐름을 가져야 한다.

```text
실제 변화
→ 해석
→ 초보자 레슨
→ 다음 확인 질문
```

데이터가 부족하면 아래처럼 부족함을 드러내야 한다.

```text
이번 자동 수집에서는 Azure 성장률 수치가 아직 확인되지 않았습니다.
따라서 이번 주에는 가격 변화, 점수 변화, 관련 뉴스 후보만으로 1차 가설을 세우고,
다음 실적 발표에서 Azure 성장률과 AI 투자비 설명을 확인해야 합니다.
```

### 2-3. QA가 구조 실패를 막지 못한다

현재 QA는 추천 표현, 데이터 신뢰도, 로그 상태는 보지만 필수 섹션 누락을 강하게 차단하지 않는다.

앞으로 QA Gate는 아래 항목을 검사해야 한다.

- 필수 섹션 누락
- 금지 문장 패턴 반복
- 실제 변화 없이 해석만 있는 문장
- 데이터 부족을 사실처럼 쓰는 문장
- 이메일 HTML에 운영 정보가 섞인 경우

### 2-4. 테스트가 실제 리포트 품질 계약을 확인하지 않는다

현재 `tests/weekly-full-cycle-contract.test.js`는 전체 사이클 함수와 예약 연결은 확인하지만, 리포트 본문이 Weekly Lab 구조를 따르는지는 확인하지 않는다.

따라서 코드가 예전 5섹션 초안을 만들어도 테스트가 통과할 수 있다.

## 3. 설계 원칙

### 3-1. 하드코딩을 줄인다

아래 값은 코드에 고정하지 않는다.

- 실행 요일
- 실행 시간
- "화요일 오전" 같은 표시 문구
- Top N 개수
- 리포트 섹션 제목
- 필수 섹션 목록
- 이메일에 포함할 섹션 목록

대신 아래 순서로 읽는다.

```text
Google Sheets 설정
→ report_blueprint 탭
→ user_preferences / automation_schedules
→ 코드 내 기본값 fallback
```

코드 내 기본값은 "운영 시드" 역할만 한다. 실제 운영 중 바꾸는 값은 시트에서 바꿀 수 있어야 한다.

### 3-2. 검증은 중복하지 않고 한 번에 모은다

각 단계가 시트를 반복해서 전부 다시 읽으면 느리고 복잡해진다. 이번 개선에서는 한 번 만든 `reportContext`를 공유한다.

```text
collectReportContext_()
→ buildReportSectionModels_()
→ runReportQualityGate_()
→ renderDocsDraft_()
→ renderEmailHtmlDraft_()
```

검증도 단계마다 비슷한 검사를 반복하지 않는다. 마지막 QA Gate에서 구조/문장/출력분리 검사를 모아서 수행한다.

### 3-3. Docs 초안과 이메일 HTML의 역할을 분리한다

Docs 초안은 편집자용이다. 운영 메모, QA 결과, 발행 전 체크리스트가 들어갈 수 있다.

이메일 HTML은 독자용이다. 아래 문구는 들어가면 안 된다.

- QA 상태
- blocked
- error_log
- bottleneck_log
- 운영 체크리스트
- "로그를 확인하세요" 같은 운영자 지시

### 3-4. Apps Script 런타임 제약을 인정한다

Google Apps Script는 로컬 저장소의 Markdown 파일을 실행 중 직접 읽을 수 없다. 따라서 `templates/weekly-report-template.md`를 매번 파싱하는 구조는 현실적이지 않다.

대신 시트에 `report_blueprint` 탭을 둔다.

이 탭은 템플릿의 운영 가능한 버전이다.

```text
Markdown 템플릿 = 사람이 읽는 설계도
report_blueprint = Apps Script가 읽는 실행용 목차표
```

## 4. 새 구조

### 4-1. report_blueprint 탭

새 탭을 추가한다.

탭 이름:

```text
report_blueprint
```

컬럼:

```text
section_key
section_order
section_title
required
enabled
docs_output
email_output
data_sources
quality_rule
beginner_purpose
notes
```

기본 seed 예시:

| section_key | section_title | required | docs_output | email_output |
|---|---|---|---|---|
| executive_dashboard | Executive Dashboard | TRUE | TRUE | TRUE |
| market_map | Market Map | TRUE | TRUE | TRUE |
| industry_theme_board | Industry & Theme Board | TRUE | TRUE | TRUE |
| stock_dashboard | SSMK Stock Dashboard | TRUE | TRUE | TRUE |
| lens_deep_dive | SSMK Lens Deep Dive | TRUE | TRUE | TRUE |
| hypothesis_lab | Hypothesis Lab | TRUE | TRUE | TRUE |
| forecast_vs_actual | Forecast vs Actual | TRUE | TRUE | TRUE |
| dividend_etf_corner | Dividend & ETF Corner | TRUE | TRUE | TRUE |
| hypothesis_evolution_log | Hypothesis Evolution Log | TRUE | TRUE | FALSE |
| learning_notes | Learning Notes | TRUE | TRUE | TRUE |
| sources_limitations | Sources & Limitations | TRUE | TRUE | TRUE |
| agent_review_board | Agent Review Board | TRUE | TRUE | FALSE |

주의:

```text
section_title은 바뀔 수 있다.
QA와 코드의 핵심 기준은 section_key다.
```

### 4-2. 스케줄 키 정리

현재 코드에는 `tuesday_weekly_report`라는 이름이 많이 남아 있다.

이 이름은 과거 호환용으로 유지하되, 새 기본 키는 아래로 둔다.

```text
weekly_lab_primary_schedule
```

조회 순서:

```text
1. weekly_lab_primary_schedule
2. tuesday_weekly_report
3. 기본 seed 생성
```

이렇게 하면 현재 운영을 깨지 않으면서도 "화요일 오전"에 고정된 설계를 벗어날 수 있다.

화면 표시 문구는 아래처럼 설정값에서 만든다.

```text
매주 {요일} {시간}:00
```

예:

```text
매주 화요일 08:00
매주 수요일 09:00
매주 금요일 07:00
```

### 4-3. reportContext

리포트 생성 중 시트를 반복해서 읽지 않기 위해 한 번에 컨텍스트를 만든다.

함수 후보:

```text
collectReportContext_(issueDate, reportId, runId)
```

포함 데이터:

```text
settings
preferences
schedule
blueprint_sections
weekly_scores
market_data
news_events
hypothesis_reviews
hypothesis_lab
hypothesis_evolution_log
visualization_queue
revision_requests
report_runs
qa_review_log
```

컨텍스트는 생성과 QA가 함께 사용한다.

### 4-4. 섹션 모델

각 리포트 섹션은 문자열이 아니라 모델로 만든다.

예시:

```javascript
{
  section_key: 'market_map',
  section_title: 'Market Map',
  status: 'draft',
  docs_markdown: '...',
  email_html_summary: '...',
  source_summary: 'market_data; visualization_queue',
  missing_data: 'VIX, 금리 데이터 없음',
  quality_flags: ['missing_optional_macro_data']
}
```

이 구조를 쓰면:

- Docs 초안과 이메일 HTML을 같은 원자료에서 만들 수 있다.
- 이메일에는 운영 정보를 제외할 수 있다.
- QA가 섹션 단위로 누락을 확인할 수 있다.

### 4-5. QA Gate

새 함수 후보:

```text
runReportQualityGate_(context, sectionModels, outputDrafts)
```

검사 항목:

| 검사 | 실패 기준 | 결과 |
|---|---|---|
| 필수 섹션 | `required=TRUE`인 섹션 모델 없음 | blocked |
| 금지 문장 | "관찰 우선순위를 확인합니다" 반복 | blocked |
| 추천 표현 | 매수/매도/추천/지금 사 등 | blocked |
| 데이터 없는 단정 | missing_data가 있는데 단정 표현 사용 | warning 또는 blocked |
| 이메일 운영 문구 | QA 상태/error_log/blocked/체크리스트 포함 | blocked |
| 빈 섹션 | 필수 섹션 본문이 너무 짧음 | warning |

품질 결과는 아래에 기록한다.

```text
agent_review_log
qa_review_log
report_sections
report_runs.generation_status
```

### 4-6. Docs 초안 렌더러

Docs 초안에는 아래가 포함된다.

- 모든 `docs_output=TRUE` 섹션
- 데이터 출처와 부족한 데이터
- QA 메모
- 발행 전 체크리스트
- 수정 요청 반영 여부

함수 후보:

```text
renderWeeklyLabDocsDraft_(context, sectionModels, qualityResult)
```

### 4-7. 이메일 HTML 렌더러

이메일 HTML에는 아래만 포함한다.

- `email_output=TRUE` 섹션
- 독자용 학습 문장
- 출처와 한계 요약
- 면책 문구

포함하지 않는 것:

- QA 상태
- 운영 로그
- blocked
- error_log
- bottleneck_log
- 발행 전 체크리스트

함수 후보:

```text
renderWeeklyLabEmailHtml_(context, sectionModels)
```

## 5. 데이터 부족 시 작성 규칙

자동화가 아직 모르는 데이터를 사실처럼 쓰지 않는다.

예:

```text
나쁜 문장:
MSFT는 Azure 성장률이 강해서 AI 기대가 실적으로 확인되고 있습니다.

좋은 문장:
이번 자동 수집에서는 Azure 성장률 수치가 아직 확인되지 않았습니다.
다만 MSFT의 1주 가격 변화와 SSMK 점수 변화를 보면,
시장은 여전히 AI/클라우드 기대를 관찰할 필요가 있는 상태로 볼 수 있습니다.
다음 확인 질문은 "다음 실적에서 Azure 성장률과 AI 투자비가 어떻게 설명되는가?"입니다.
```

## 6. 구현 범위

### 포함

- `report_blueprint` 탭 추가와 seed
- 스케줄 키 중립화
- 리포트 컨텍스트 수집 함수 추가
- 섹션 모델 생성 함수 추가
- Docs 초안 렌더러 교체
- 이메일 HTML 렌더러 정리
- QA Gate 강화
- 계약 테스트 추가
- 런북 업데이트

### 제외

이번 작업에서는 아래를 하지 않는다.

- 이메일 실제 발송 자동화
- 유료 API 연결
- SEC EDGAR/ETF holdings 실제 수집기 도입
- 대시보드 UI 대개편
- 기존 운영 로그 삭제
- 과거 Google Docs 파일 삭제

## 7. 구현 대상 파일

수정 후보:

```text
automation/Code.gs
automation/SettingsSidebar.html
tests/weekly-full-cycle-contract.test.js
docs/operations/weekly-lab-runbook.md
automation/google-sheets-structure-plan.md
automation/google-apps-script-plan.md
automation/ai-report-generation-workflow.md
```

생성 후보:

```text
tests/report-builder-quality-contract.test.js
docs/superpowers/plans/2026-05-06-weekly-lab-report-builder-redesign.md
```

## 8. 테스트 전략

검증은 중복을 줄이고 단계별 목적을 나눈다.

### 8-1. 로컬 계약 테스트

필수 테스트:

```text
1. report_blueprint 헤더와 seed 함수가 존재한다.
2. full cycle이 새 report builder 흐름을 호출한다.
3. buildWeeklyLabDraftReportText_의 5섹션 하드코딩 구조가 제거되거나 새 렌더러로 대체된다.
4. 필수 section_key 목록이 QA Gate에서 검사된다.
5. "관찰 우선순위를 확인합니다" 문구가 생성 기본값에 남지 않는다.
6. 이메일 HTML 렌더러에 QA 상태, blocked, error_log, bottleneck_log가 들어가지 않는다.
7. 스케줄 표시가 tuesday/화요일 하드코딩에만 의존하지 않는다.
```

실행 명령:

```bash
node tests/weekly-full-cycle-contract.test.js
node tests/report-builder-quality-contract.test.js
node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"
```

### 8-2. 실제 운영 검증

실제 Google Apps Script/Sheets 검증은 반복을 줄이기 위해 마지막에 1회만 수행한다.

권장 순서:

```text
1. setupSsmkWorkbook() 또는 필요한 schema helper 실행
2. forceRestartWeeklyLabFullCycleForToday() 또는 2026-05-05 지정 재생성 실행
3. report_sections에 필수 section_key가 모두 쌓였는지 확인
4. Docs 초안에 Dividend & ETF Corner / Forecast vs Actual이 있는지 확인
5. 이메일 HTML에 QA 상태 / blocked / error_log가 없는지 확인
6. qa_review_log가 warning/blocked 사유를 정확히 남기는지 확인
```

## 9. 마이그레이션 전략

### 9-1. 기존 데이터 보존

기존 탭과 로그는 삭제하지 않는다.

새 탭 또는 새 설정 row는 append/seed 방식으로 추가한다.

### 9-2. 기존 스케줄 호환

기존 `tuesday_weekly_report`는 바로 제거하지 않는다.

새 키 `weekly_lab_primary_schedule`이 있으면 그것을 우선 사용하고, 없으면 기존 키를 사용한다.

### 9-3. 기존 초안 재생성

2026-05-05 초안은 삭제하지 않는다. 새 구조 검증 후 새 버전으로 다시 생성한다.

권장 이름:

```text
SSMK Weekly Lab 초안 보고서 - 2026-05-05 - revised
```

또는 `report_versions`에 `v2`로 남긴다.

## 10. 성공 기준

아래 조건을 만족하면 이번 개선을 완료로 본다.

1. 예약 실행 경로가 새 리포트 빌더를 호출한다.
2. 리포트 구조가 시트의 `report_blueprint` 기준으로 만들어진다.
3. `Dividend & ETF Corner`와 `Forecast vs Actual`이 누락되면 QA가 통과하지 못한다.
4. "관찰 우선순위를 확인합니다" 패턴이 자동 생성 기본 문장에 남지 않는다.
5. 이메일 HTML에 운영 정보가 섞이지 않는다.
6. 스케줄 문구가 "화요일 오전"으로 고정되지 않는다.
7. 로컬 계약 테스트와 Apps Script 문법 검사가 통과한다.
8. 실제 운영 검증은 마지막 1회만 수행하고 결과를 런북 또는 작업 로그에 남긴다.

## 11. 구현 순서 제안

1. 테스트를 먼저 추가한다.
2. `report_blueprint` 스키마와 seed를 추가한다.
3. 스케줄 키 조회 helper를 중립화한다.
4. `collectReportContext_()`를 만든다.
5. `buildReportSectionModels_()`를 만든다.
6. `runReportQualityGate_()`를 만든다.
7. Docs 초안 렌더러를 새 구조로 교체한다.
8. 이메일 HTML 렌더러에서 운영 정보를 제거한다.
9. full cycle을 새 리포트 빌더로 연결한다.
10. 문서와 런북을 업데이트한다.
11. 로컬 검증을 수행한다.
12. 사용자 승인 후 실제 Sheets/Apps Script 1회 재생성 검증을 수행한다.

## 12. 열어둔 판단

이번 설계에서 의도적으로 열어두는 부분:

- section_title은 이후 사용자가 더 쉬운 한국어 제목으로 바꿀 수 있다.
- 실행 요일과 시간은 `automation_schedules`와 `user_preferences`에서 바꿀 수 있다.
- Top N은 `settings.top_n` 또는 `user_preferences.core_hypothesis_count`를 우선한다.
- 데이터 수집 범위는 이번 작업에서 확장하지 않는다. 부족한 데이터는 부족하다고 쓰는 것이 우선이다.

## 13. 사용자 승인 후 다음 단계

이 spec이 승인되면 다음에는 구현 계획 문서를 만든다.

계획 문서 위치:

```text
docs/superpowers/plans/2026-05-06-weekly-lab-report-builder-redesign.md
```

구현 계획은 TDD 방식으로 작성한다.

```text
테스트 추가
→ 실패 확인
→ 최소 구현
→ 통과 확인
→ 다음 작은 작업
```
