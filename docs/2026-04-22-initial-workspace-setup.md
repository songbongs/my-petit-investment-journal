# SSMK 초기 작업공간 세팅 기록

작성일: 2026-04-22

## 완료한 작업

### 1. Google Drive 폴더 확인

사용자가 만든 Google Drive 폴더를 확인했다.

```text
[private Google Drive path removed]
```

Google Drive 커넥터에서 확인된 폴더 URL은 다음과 같다.

```text
[private Google Drive link removed]
```

### 2. Google Sheets 점수표 생성

Google Sheets 파일을 생성했다.

```text
SSMK 투자 관찰노트 - 점수표
```

URL:

```text
[private Google Sheets link removed]
```

현재 Google Drive 커넥터의 파일 생성 기능은 새 파일을 기본 Drive 위치에 만들 수 있지만, 특정 폴더로 이동하는 기능은 노출되어 있지 않다. 따라서 시트는 생성 및 구성 완료 상태이며, 필요하면 사용자가 Google Drive 화면에서 `SSMK-investment-journal` 폴더로 이동하면 된다.

### 3. Google Sheets 탭 구성

생성한 시트에는 다음 탭을 만들었다.

- `settings`: 프로젝트 설정, 발행 요일, 점수 만점, 발행 방식
- `watchlist`: 초기 관찰 종목 20개
- `weekly_scores`: 매주 SSMK 점수 입력/계산용
- `score_history`: 과거 점수 누적용
- `industry_notes`: 산업별 핵심 지표와 이벤트
- `report_queue`: 주간 리포트에 넣을 후보 관리
- `recipients`: 이메일 수신자 목록
- `news_events`: 뉴스와 이벤트 기록
- `data_sources`: 주요 데이터 출처

### 4. 이메일 수신자 등록

초기 수신자는 사용자 1명으로 등록했다.

```text
iamsangmin@naver.com
```

### 5. 초기 워치리스트 20개 선정

초기 워치리스트는 매수 추천 목록이 아니라, 산업별 흐름과 기업 지표를 공부하기 위한 관찰 후보로 선정했다.

이후 검토를 통해 월간 리뷰용 `핵심 산업`과 종목별 `테마 태그`를 분리하는 방식으로 정리했다. 산업은 회사가 실제로 돈을 버는 본업이고, 테마는 시장이 지금 관심 갖는 큰 흐름이다.

| 핵심 산업 | 티커 | 대표 테마 태그 | 대표 투자 성격 |
|---|---|---|---|
| AI/클라우드/반도체 인프라 | MSFT, NVDA, QCOM, AAPL | AI, 클라우드, 반도체, 온디바이스 AI | 성장주, 혼합 |
| 디지털 플랫폼/광고 | GOOGL, META, TTD | 광고, 플랫폼, AI 광고 도구 | 성장주, 플랫폼 |
| 미디어/게임/콘텐츠 | NFLX, DIS, TTWO | 스트리밍, 콘텐츠, 게임, 턴어라운드 | 성장주, 턴어라운드 |
| 자동차/전기차 | TSLA, GM | 전기차, 자율주행, 가격 경쟁 | 성장주, 경기민감, 턴어라운드 |
| 헬스케어/제약 | JNJ, LLY, MRK | 신약, 파이프라인, 방어주, 배당 | 방어주, 배당주, 성장주 |
| 에너지/산업소재 | XOM, CVX, LIN | 유가, 현금흐름, 산업용 가스, 배당 | 배당주, 경기민감 |
| 글로벌 소비재/럭셔리 | EL, LVMUY | 중국 소비, 브랜드 파워, 럭셔리, 마진 | 소비재, 턴어라운드 |

선정 기준은 다음과 같다.

- 산업별 흐름을 공부하기 좋은 대표성이 있는가
- 미국 시장에서 데이터 접근이 쉬운가
- 실적, 공시, 뉴스, 이벤트를 꾸준히 추적할 가치가 있는가
- 배당주와 성장주가 적절히 섞여 있는가
- 초보자가 산업별 차이와 테마별 흐름을 함께 배우기에 좋은가

### 6. Notion 프로젝트 허브 업데이트

Notion 워크스페이스 `song's cave`에서 `SSMK-investment-journal` 페이지를 찾아 프로젝트 허브로 업데이트했다.

URL:

```text
[private Notion link removed]
```

Notion 페이지에는 다음 내용을 넣었다.

- 프로젝트 개요
- 핵심 원칙
- Google Sheets 점수표 링크
- 로컬 프로젝트 폴더 경로
- Google Drive 폴더 경로
- 초기 워치리스트
- 다음 작업 목록
- 투자 권유가 아니라는 주의 문구

## 다음 작업

다음 단계에서는 이미 작성된 점수 모델, 샘플 CSV, Google Sheets 구조 계획, AI 자동 리포트 생성 흐름, AI 프롬프트, Apps Script 설계 계획을 실제 Google Sheets와 `Code.gs` 초안에 연결한다. 콘텐츠 템플릿, 1회차 샘플 리포트, `docs/score-model-v1.md`, `data/sample-score-table.csv`, `data/sample-hypothesis-review-table.csv`, `automation/google-sheets-structure-plan.md`, `automation/ai-report-generation-workflow.md`, `automation/ai-prompt-weekly-report.md`, `automation/ai-prompt-hypothesis-review.md`, `automation/google-apps-script-plan.md`는 작성 완료 상태다.

1. 실제 Google Sheets 열 구조를 `automation/google-sheets-structure-plan.md` 기준으로 업데이트
2. `automation/Code.gs` 초안 작성
3. Google Sheets 샘플 데이터로 주간 리포트 초안 생성 테스트
4. 승인 상태일 때만 이메일 발송되도록 테스트
5. PDF/이메일 발행 승인 테스트

AI 가설은 아래 구조를 유지한다.

```text
가설 요약
→ 근거 지표/데이터
→ 이 지표/데이터를 보고 왜 그렇게 예상했나
→ 초보자가 배울 포인트
→ 한계와 다음 확인
```

이후 Google Sheets에서는 기존 `industry` 중심 기록보다 `core_industry`, `theme_tags`, `investment_style`을 함께 쓰는 방식으로 정리하는 것이 좋다.
