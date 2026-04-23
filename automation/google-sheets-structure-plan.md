# Google Sheets 구조 업데이트 계획

작성일: 2026-04-22

## 1. 목적

이 문서는 `SSMK 투자 관찰노트 - 점수표`를 현재 프로젝트 철학에 맞게 업데이트하기 위한 설계안이다.

핵심 변화는 다음이다.

```text
기존: 점수와 관찰 후보 중심
변경: 점수 + AI 가설 + 근거 지표 + 해석 이유 + 초보자 레슨 + 실제 결과 복기
```

이 구조가 필요한 이유는 단순하다. 사용자가 주식 초보자이기 때문에, 리포트는 "결론"보다 "왜 그런 결론처럼 보이는지"를 가르쳐야 한다. 따라서 Google Sheets도 점수만 저장하는 표가 아니라, AI가 어떤 지표를 보고 어떤 가설을 세웠는지 기록하는 학습 데이터베이스 역할을 해야 한다.

---

## 2. 유지할 기존 탭

현재 시트의 기본 탭은 유지한다.

```text
settings
watchlist
weekly_scores
score_history
industry_notes
report_queue
recipients
news_events
data_sources
```

다만 `weekly_scores`, `score_history`, `report_queue`는 컬럼을 확장한다.

---

## 3. 새로 추가할 추천 탭

### 3-1. hypothesis_reviews

AI가 만든 가설을 실제 결과와 비교하기 위한 탭이다.

필요한 이유:

```text
AI가 이번 주에 어떤 가설을 세웠는지 기록하지 않으면,
나중에 실제 결과와 비교할 수 없다.
비교할 수 없으면 배움이 쌓이지 않는다.
```

권장 컬럼:

```text
hypothesis_id
issue_date
review_date
review_window
ticker
company
core_industry
hypothesis_summary
evidence_metrics
reasoning_explanation
beginner_lesson
limitations
next_check
actual_outcome
outcome_data
result_label
lesson_learned
model_adjustment
data_confidence
uncertainty_level
review_status
```

### 3-2. report_runs

매주 리포트 생성 상태를 기록하는 탭이다.

권장 컬럼:

```text
report_id
issue_date
week_start
week_end
generation_status
generated_at
approved_at
sent_at
recipient_group
report_file_path
pdf_file_path
email_subject
notes
```

초보자용 설명:

```text
report_runs는 리포트의 출석부입니다.
이번 주 리포트가 생성됐는지, 승인됐는지, 발송됐는지 한 줄로 확인하는 용도입니다.
```

### 3-3. automation_stage_reviews

자동화 발전 단계로 넘어갈지 판단하기 위한 품질 자가검증 탭이다.

필요한 이유:

```text
사용자가 매번 자동화 시점을 직접 기억하기 어렵기 때문에,
AI가 품질 상태를 점검하고 "다음 단계로 가도 될지" 제안하기 위한 근거를 남깁니다.
```

권장 컬럼:

```text
review_date
current_stage
quality_score
hypothesis_structure_pass_rate
beginner_explanation_quality
data_confidence_summary
source_stability
user_revision_level
recurring_manual_work
ai_recommendation
recommended_next_stage
proposal_summary
approval_status
approved_by
approved_at
notes
```

### 3-4. change_approval_log

중요 변경 제안과 승인 결과를 기록하는 탭이다.

권장 컬럼:

```text
change_id
proposed_at
change_type
proposal_title
reason
expected_benefit
risk
rollback_plan
approval_status
approved_at
applied_at
result_note
```

### 3-5. agent_review_log

각 에이전트가 주간 리포트나 자동화 제안을 어떻게 평가했는지 남기는 탭이다.

필요한 이유:

```text
콘텐츠를 만든 AI와 검증하는 AI를 분리하려면,
각 역할이 무엇을 통과/경고/차단했는지 기록이 남아야 합니다.
```

권장 컬럼:

```text
review_id
issue_date
agent_name
agent_role
review_target
status
finding_summary
risk_level
required_action
blocking
resolved
resolved_at
notes
```

상태값:

```text
pass
warning
block
proposal
```

---

## 4. weekly_scores 권장 컬럼

`weekly_scores`는 매주 종목별 점수와 AI 가설 초안을 담는 중심 탭이다.

권장 컬럼:

```text
issue_date
week_start
ticker
company
core_industry
theme_tags
investment_style
core_score
shareholder_return_score
industry_score
business_model_score
valuation_timing_score
insider_event_score
ssmk_total_score
observation_grade
previous_score
score_change
data_confidence
uncertainty_level
risk_flag
hypothesis_summary
evidence_metrics
reasoning_explanation
beginner_lesson
limitations
next_check
source_links
review_status
```

컬럼 의미:

| 컬럼 | 쉬운 설명 |
|---|---|
| `ssmk_total_score` | 10점 만점 관찰 점수 |
| `observation_grade` | 점수를 높음/중간/낮음으로 바꾼 표현 |
| `data_confidence` | 사용한 자료를 얼마나 믿을 수 있는지 |
| `uncertainty_level` | 아직 모르는 변수가 얼마나 큰지 |
| `hypothesis_summary` | AI가 세운 학습용 가설 |
| `evidence_metrics` | 가설을 만든 근거 지표 |
| `reasoning_explanation` | 그 지표를 보고 왜 그렇게 해석했는지 |
| `beginner_lesson` | 초보자가 이 지표에서 배울 점 |
| `limitations` | 이 가설의 한계 |
| `next_check` | 다음에 확인할 자료나 이벤트 |

---

## 5. 기본 수식 예시

아래 수식은 Google Sheets에서 쓸 수 있는 예시다. 실제 열 위치에 맞춰 셀 주소는 조정해야 한다.

### 5-1. SSMK 총점

```text
=ROUND(H2*0.30 + I2*0.20 + J2*0.20 + K2*0.15 + L2*0.10 + M2*0.05, 2)
```

초보자용 설명:

```text
각 항목 점수에 중요도 비중을 곱해서 더하는 방식입니다.
기업 체력은 30%, 배당/주주환원은 20%처럼 항목마다 영향력을 다르게 둡니다.
```

### 5-2. 관찰 등급

```text
=IFS(N2>=8,"높음",N2>=6,"중간",TRUE,"낮음")
```

초보자용 설명:

```text
8점 이상이면 "높음", 6점 이상이면 "중간", 그보다 낮으면 "낮음"으로 표시합니다.
이 등급은 매수 신호가 아니라 이번 주 공부 우선순위입니다.
```

### 5-3. 점수 변화

```text
=IFERROR(N2-P2,"")
```

초보자용 설명:

```text
이번 주 점수에서 지난주 점수를 뺀 값입니다.
점수가 올랐는지 내렸는지보다 왜 변했는지가 더 중요합니다.
```

---

## 6. 데이터 유효성 추천값

아래 항목은 드롭다운으로 만드는 것이 좋다.

| 컬럼 | 추천값 |
|---|---|
| `observation_grade` | 높음, 중간, 낮음 |
| `data_confidence` | 높음, 중간, 낮음 |
| `uncertainty_level` | 높음, 중간, 낮음 |
| `review_status` | 초안, 질문 중, 승인, 보류 |
| `result_label` | 맞음, 부분적으로 맞음, 빗나감, 아직 모름 |
| `approval_status` | proposed, approved, rejected, postponed, applied, rolled_back |
| `agent_review_status` | pass, warning, block, proposal |

---

## 7. 업데이트 순서

1. 현재 Google Sheets를 복사해 백업본을 만든다.
2. `weekly_scores`에 새 컬럼을 추가한다.
3. `hypothesis_reviews` 탭을 새로 만든다.
4. `report_runs` 탭을 새로 만든다.
5. `automation_stage_reviews` 탭을 새로 만든다.
6. `change_approval_log` 탭을 새로 만든다.
7. `agent_review_log` 탭을 새로 만든다.
8. 점수 계산 수식과 관찰 등급 수식을 넣는다.
9. 드롭다운 값을 설정한다.
10. `data/sample-score-table.csv`의 샘플 5개 행을 테스트로 붙여 넣는다.
11. 주간 리포트 템플릿에 필요한 값이 모두 있는지 확인한다.

주의:

```text
처음부터 실제 발송까지 자동화하지 않습니다.
먼저 표가 리포트 초안을 만들기에 충분한지 확인합니다.
```

---

## 8. 완료 기준

이 작업은 아래 조건을 만족하면 완료로 본다.

- `weekly_scores`에 AI 가설 구조 컬럼이 모두 있다.
- `hypothesis_reviews`에서 지난 가설과 실제 결과를 비교할 수 있다.
- `report_runs`에서 리포트 생성/승인/발송 상태를 추적할 수 있다.
- `automation_stage_reviews`에서 다음 자동화 단계 제안 근거를 기록할 수 있다.
- `change_approval_log`에서 중요한 변경의 승인/보류/거절 기록을 남길 수 있다.
- `agent_review_log`에서 루미, 벡터, 세이지, 파일럿, 노바의 검토 결과를 남길 수 있다.
- 샘플 데이터 5개 행으로 주간 리포트 초안 작성이 가능하다.
- 모든 핵심 문장에 투자 추천이 아니라 학습용 관찰 기록이라는 전제가 유지된다.
