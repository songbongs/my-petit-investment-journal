# SSMK Weekly Lab

SSMK Weekly Lab은 미국주식, ETF, 배당주, 산업 흐름을 매주 같은 기준으로 관찰하고 기록하기 위한 투자 공부 프로젝트입니다.

이 프로젝트는 종목 추천 서비스가 아닙니다. 목표는 “무엇을 살까?”를 대신 판단하는 것이 아니라, “무엇을 어떻게 봐야 할까?”를 매주 훈련하는 것입니다.

> 최우선 기준 문서: [SSMK Weekly Lab Soul](docs/SSMK-WEEKLY-LAB-SOUL.md)

## 한 줄 정의

```text
SSMK Weekly Lab = 미국주식과 ETF를 매주 관찰하고,
가설을 세우고,
실제 결과와 비교하면서
투자 공부 질문을 더 좋게 만드는 학습형 리서치 시스템
```

## 이 프로젝트가 아닌 것

이 프로젝트는 아래 목적을 갖지 않습니다.

- 특정 종목 매수/매도 추천
- 단기 트레이딩 신호 생성
- 점수만 보고 투자 판단하기
- AI가 투자 결정을 대신하기
- 검증되지 않은 뉴스나 수치를 사실처럼 발행하기

## 핵심 원칙

1. 투자 권유가 아니라 투자 공부 기록으로 운영한다.
2. 점수는 정답이 아니라 관찰 우선순위를 돕는 도구다.
3. 모든 핵심 문장은 실제 데이터에서 출발한다.
4. 데이터가 부족하면 부족하다고 솔직하게 표시한다.
5. AI는 데이터 정리, 가설 생성, 초보자용 해석, 초안 작성, 복기 보조를 맡는다.
6. 사람은 첫 번째 학습자이자 편집장으로 질문하고 최종 발송을 승인한다.
7. 이메일 자동 발송은 기본 OFF이며, 외부 발송은 사용자 승인 후에만 진행한다.

## 좋은 리포트 문장의 흐름

SSMK Weekly Lab의 콘텐츠는 아래 순서를 따른다.

```text
실제 변화
→ 해석
→ 초보자 레슨
→ 다음 확인 질문
```

예를 들어 “점수가 높다”에서 끝내지 않고, 왜 점수가 변했는지, 어떤 데이터가 부족한지, 다음에 무엇을 확인해야 하는지까지 기록한다.

## 시스템 개요

현재 구조는 Google Sheets와 Google Apps Script를 중심으로 한다.

```text
Google Sheets
→ Google Apps Script
→ Weekly Lab Workflow
→ Google Docs 초안
→ 이메일 HTML 검토본
→ QA / 로그
→ 사용자 승인
```

역할 구분:

| 산출물 | 목적 |
|---|---|
| 운영 대시보드 | 자동화 실행 상태, 경고, 실패, 다음 액션 확인 |
| Google Docs 초안 | 사용자가 검토하고 수정하는 편집자용 초안 |
| 이메일 HTML 검토본 | 독자가 읽는 학습 콘텐츠 후보 |

## 주요 폴더

```text
SSMK-investment-journal/
├─ README.md
├─ AGENTS.md
├─ docs/
├─ automation/
├─ templates/
├─ reports/
├─ data/
└─ tests/
```

| 폴더 | 역할 |
|---|---|
| `docs` | 프로젝트 철학, 설계, 인수인계, 의사결정 기록 |
| `automation` | Apps Script 코드, 자동화 설계, 프롬프트 |
| `templates` | Weekly Lab 리포트 템플릿 |
| `reports` | 샘플 리포트와 향후 리포트 결과물 |
| `data` | 샘플 CSV와 데이터 구조 예시 |
| `tests` | Apps Script/문서 구조를 확인하는 Node.js 테스트 |

## 주요 문서

처음 읽을 문서:

- [SSMK Weekly Lab Soul](docs/SSMK-WEEKLY-LAB-SOUL.md)
- [프로젝트 철학과 설계 기록](docs/2026-04-22-project-philosophy-and-design.md)
- [AI 학습형 관찰 아키텍처](docs/ai-assisted-learning-architecture.md)
- [자동화 준비도와 발전 로드맵](docs/2026-04-22-automation-readiness-and-roadmap.md)
- [Weekly Lab 운영 런북](docs/operations/weekly-lab-runbook.md)
- [GitHub 후보 프로젝트 수집 인수인계](docs/2026-05-02-github-candidate-research-handoff.md)

## 운영 정보와 개인 링크 관리

공개 저장소의 README에는 실제 Google Sheets, Drive, Notion, Obsidian 볼트 경로, 예약 ID 같은 개인 운영 정보를 적지 않는다.

개인 운영 정보는 로컬 전용 문서에서 관리한다.

```text
docs/private/
```

이 폴더는 `.gitignore`에 포함되어 GitHub에 올라가지 않는다.

공개 문서에는 필요한 경우 아래처럼 일반 설명만 남긴다.

```text
실제 운영 링크와 개인 작업공간 정보는 로컬 private 문서에서 관리한다.
```

## 현재 상태 요약

- Weekly Lab의 기본 철학과 soul 문서가 정리되어 있다.
- Google Sheets + Apps Script 기반의 초안 생성/로그/QA 구조가 구현되어 있다.
- Weekly Lab 전체 사이클과 Control Center 관련 계약 테스트가 있다.
- 외부 GitHub 프로젝트를 참고 후보로 수집하는 기준과 1차 후보 리스트가 정리되어 있다.
- 다음 단계는 반복 실행 안정성, 데이터 수집 품질, Dividend & ETF Corner, Forecast vs Actual 복기 품질을 높이는 것이다.

## 테스트

현재 저장소의 기본 검증은 Node.js로 실행한다.

```bash
node tests/watchlist-normalization.test.js
node tests/watchlist-classification-guide.test.js
node tests/control-center-automation-dashboard.test.js
node tests/weekly-full-cycle-contract.test.js
node -e "const fs=require('fs'); new Function(fs.readFileSync('automation/Code.gs','utf8')); console.log('Code.gs syntax ok')"
```

## 주의 문구

이 저장소의 모든 내용은 투자 공부와 관찰 기록을 위한 것입니다. 투자 권유, 종목 추천, 매수/매도 지시가 아닙니다.
