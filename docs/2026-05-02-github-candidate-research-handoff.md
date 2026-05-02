# 2026-05-02 GitHub 후보 프로젝트 수집 체계 작업 인수인계

작성일: 2026-05-02

## 1. 오늘 작업의 목적

오늘 작업은 SSMK Weekly Lab을 더 발전시키기 위해 참고할 만한 외부 GitHub 프로젝트를 무작정 도입하는 것이 아니라, 먼저 안정적인 수집 기준과 기록 양식을 만들고, 그 기준에 맞춰 1차 후보 프로젝트 30개를 수집하는 것이었다.

핵심 원칙은 아래와 같다.

```text
외부 프로젝트를 많이 모으는 것이 목적이 아니다.
SSMK의 soul을 지키면서 더 좋은 투자 공부 질문을 만들 수 있는 참고 포인트를 발견하는 것이 목적이다.
```

최종 판단 질문:

```text
이 프로젝트 또는 아이디어가 사용자가 더 좋은 투자 공부 질문을 하게 도와주는가?
```

## 2. 오늘 완료한 작업

### 2-1. Obsidian 프로젝트 기록 구조 생성

SSMK Weekly Lab 프로젝트를 Obsidian `my-AI-Playground` 볼트에 프로젝트 단위로 정리했다.

Obsidian 위치:

```text
[private Obsidian project path removed]
```

생성/정리된 주요 문서:

```text
00_Project Atlas.md
01_프로젝트 소개.md
02_Soul과 운영 원칙.md
03_시스템 구조와 주요 기능.md
04_현재 운영 방법.md
05_현재 상태와 구현 이력.md
06_향후 과제와 리스크.md
07_변경 이력.md
08_의사결정 기록.md
09_용어와 핵심 개념.md
10_외부 참고 프로젝트 수집함.md
sources/원본 프로젝트 문서 목록.md
sources/외부 벤치마킹 요약.md
logs/2026-05-02 프로젝트 초기 정리.md
```

### 2-2. GitHub 후보 수집 기준 문서 작성

아래 기획 문서를 Obsidian에 추가했다.

```text
sources/GitHub 검색 전략과 평가 기준.md
```

이 문서에는 다음 내용이 들어 있다.

- GitHub 후보 수집 목적
- SSMK soul 보호 원칙
- 7개 수집 카테고리
- 카테고리별 검색 키워드
- GitHub 검색 기본 조건
- 1차 수집 필드
- A/B/C 우선순위 기준
- 심층 검토 점수표
- 감점 기준
- 실제 사용 시나리오 3개 규칙
- 수집 후 승격 규칙

### 2-3. GitHub 후보 리스트 양식 작성

아래 후보 리스트 문서를 Obsidian에 추가했다.

```text
sources/GitHub 후보 프로젝트 1차 리스트.md
```

기록 필드:

```text
우선순위
카테고리
프로젝트
GitHub
발견 키워드
Stars
언어
마지막 업데이트
참고 가능 포인트
주의점
상태
```

상태값:

```text
후보
검토 예정
보류
심층 검토
아이디어 추출 완료
SSMK 반영 후보
폐기
```

우선순위:

```text
A = 다음 검토 때 우선 확인
B = 참고 가능성 있음
C = 보류 후보
```

### 2-4. GitHub 1차 후보 30개 수집

GitHub Search API와 GitHub HTML 검색 보조를 사용해 후보 30개를 수집했다.

저장 위치:

```text
[private Obsidian project path removed]\sources\GitHub 후보 프로젝트 1차 리스트.md
```

수집 카테고리:

- SEC / EDGAR / 공시
- 미국 주식 가격 / 재무 데이터
- ETF / 배당 데이터
- 포트폴리오 / 백테스트 / 리스크
- 뉴스 / 이벤트 / 감성 분석
- AI 리서치 자동화
- 대시보드 / 시각화 / 리포트 UI

대표 후보:

```text
dgunning/edgartools
sec-edgar/sec-edgar
jadchaar/sec-edgar-downloader
wescules/insider-trading-analyzer
nikulpatel3141/ETF-Scraper
PiperBatey/holdings_dl
ranaroussi/quantstats
virattt/ai-financial-agent
```

주의:

이 30개 후보는 도입 결정이 아니다. 다음 단계에서 일부만 심층 검토해야 한다.

## 3. 오늘 검증한 내용

Obsidian 반영 후 PowerShell로 아래를 확인했다.

```text
후보 리스트 문서 존재 확인
실제 기록 후보 수: 30개 문구 확인
SEC/EDGAR 대표 후보 포함 확인
ETF 후보 포함 확인
AI 리서치 자동화 후보 포함 확인
외부 참고 프로젝트 수집함에 수집 완료 요약 반영 확인
향후 과제와 리스크 문서의 P7 진행 기록 반영 확인
```

최종 검증 결과:

```text
CANDIDATE_EXISTS=True
HAS_30=True
HAS_A=True
HAS_ETF=True
HAS_AI=True
EXTERNAL_SUMMARY=True
RISK_UPDATE=True
```

## 4. 추후 작업 재개 시 먼저 확인할 문서

작업을 재개할 때는 아래 순서로 읽으면 된다.

### Obsidian 쪽

```text
10_Projects/SSMK-Weekly-Lab/00_Project Atlas.md
10_Projects/SSMK-Weekly-Lab/10_외부 참고 프로젝트 수집함.md
10_Projects/SSMK-Weekly-Lab/sources/GitHub 검색 전략과 평가 기준.md
10_Projects/SSMK-Weekly-Lab/sources/GitHub 후보 프로젝트 1차 리스트.md
10_Projects/SSMK-Weekly-Lab/06_향후 과제와 리스크.md
```

### 프로젝트 작업폴더 쪽

```text
AGENTS.md
README.md
docs/SSMK-WEEKLY-LAB-SOUL.md
docs/2026-05-02-github-candidate-research-handoff.md
```

## 5. 다음에 이어가면 좋은 작업

### 1순위. A등급 후보 3~5개 심층 검토

추천 후보:

```text
dgunning/edgartools
jadchaar/sec-edgar-downloader
wescules/insider-trading-analyzer
nikulpatel3141/ETF-Scraper
PiperBatey/holdings_dl
```

추천 이유:

- SEC/EDGAR 공시 원자료와 연결 가능
- Form 4 내부자 거래와 연결 가능
- ETF holdings와 Dividend & ETF Corner 강화에 직접 연결 가능
- SSMK의 `report_fact_cards`, `signal_presets`, `Dividend & ETF Corner`, `내부자/이벤트 점수` 후보와 관련이 깊음

심층 검토 시 볼 것:

```text
1. 이 프로젝트는 무엇을 하는가?
2. SSMK에 참고할 수 있는 구조는 무엇인가?
3. 그대로 가져오면 안 되는 점은 무엇인가?
4. SSMK식으로 바꾸면 어떤 개선 후보가 되는가?
5. 실제 사용 시나리오가 최소 3개 있는가?
6. 향후 과제와 리스크 문서로 승격할 가치가 있는가?
```

### 2순위. 후보별 개별 검토 노트 폴더 만들기

A등급 후보를 심층 검토하기 시작하면 아래 폴더를 만드는 것이 좋다.

```text
10_Projects/SSMK-Weekly-Lab/sources/github-candidates/
```

예상 파일:

```text
dgunning-edgartools.md
jadchaar-sec-edgar-downloader.md
wescules-insider-trading-analyzer.md
nikulpatel3141-ETF-Scraper.md
PiperBatey-holdings_dl.md
```

### 3순위. 실제 개선 후보로 승격

심층 검토 후 실제 가치가 있으면 `06_향후 과제와 리스크.md`에 별도 후보로 승격한다.

예상 승격 후보:

```text
P8. SEC EDGAR 기반 Fact Card 생성 검토
P9. Form 4 내부자 거래 signal preset 검토
P10. ETF holdings 기반 ETF concentration risk 검토
P11. Dividend & ETF Corner 자동 데이터 보강 검토
```

### 4순위. 중요한 판단은 ADR로 기록

외부 프로젝트에서 가져온 아이디어가 SSMK 운영 원칙이나 데이터 구조를 바꿀 정도라면 `08_의사결정 기록.md`에 ADR로 남긴다.

예:

```text
ADR-005. SEC EDGAR 데이터를 Source Layer로 도입할지 여부
ADR-006. ETF holdings 데이터를 Dividend & ETF Corner 필수 입력으로 둘지 여부
ADR-007. 내부자 거래 Form 4를 내부자/이벤트 점수에 반영할지 여부
```

## 6. 다음 작업 시 지켜야 할 원칙

1. 외부 프로젝트를 바로 도입하지 않는다.
2. 매수/매도 신호 중심 기능은 SSMK에 직접 반영하지 않는다.
3. 데이터 수집 구조와 AI 해석 구조를 분리해서 본다.
4. 초보자가 이해할 수 있는 질문으로 바꿀 수 있는지 본다.
5. 실제 사용 시나리오가 3개 이상 없으면 깊게 파지 않는다.
6. 반영 전에는 반드시 사용자 승인 또는 별도 의사결정 기록을 남긴다.
7. 최종 판단 질문을 계속 유지한다.

```text
이 변경이 사용자가 더 좋은 투자 공부 질문을 하게 도와주는가?
```

## 7. 오늘 작업 중 주의했던 점

- GitHub API rate limit이 일부 발생했다.
- 일부 후보는 Stars나 마지막 업데이트가 `확인 필요`로 남아 있다.
- 이 항목들은 심층 검토 때 GitHub repo page와 README를 다시 확인하면 된다.
- Obsidian Windows Google Drive 경로는 WSL에서 직접 접근하지 않고 PowerShell `-LiteralPath`와 Windows temp script 방식을 사용했다.
- PowerShell 스크립트에 한글 경로가 있을 때는 UTF-8 BOM이 있는 `.ps1`이 더 안전했다.

## 8. 짧은 재개 프롬프트

다음 AI에게 이어서 시킬 때는 아래처럼 요청하면 된다.

```text
SSMK Weekly Lab의 GitHub 후보 프로젝트 수집 작업을 이어가자.
먼저 Obsidian의 `10_Projects/SSMK-Weekly-Lab/00_Project Atlas.md`,
`sources/GitHub 검색 전략과 평가 기준.md`,
`sources/GitHub 후보 프로젝트 1차 리스트.md`,
그리고 프로젝트 폴더의 `docs/2026-05-02-github-candidate-research-handoff.md`를 확인해줘.
그 다음 A등급 후보 중 3~5개를 골라 심층 검토하고,
SSMK의 soul을 훼손하지 않으면서 참고할 수 있는 개선 아이디어만 추출해줘.
실제 반영은 하지 말고, 먼저 `06_향후 과제와 리스크.md`에 승격할 후보를 제안해줘.
```
