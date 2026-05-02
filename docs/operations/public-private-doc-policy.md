# 공개 문서와 private 운영 정보 분리 원칙

이 문서는 SSMK Weekly Lab 저장소에서 공개 README와 공개 문서에 어떤 정보를 남기고, 어떤 정보를 private 문서로 분리할지 정리한다.

## 1. 기본 원칙

공개 GitHub 저장소에는 프로젝트를 이해하는 데 필요한 정보만 남긴다.

아래 정보는 공개 문서에 직접 적지 않는다.

- 실제 Google Sheets URL
- 실제 Google Docs URL
- 실제 Google Drive 폴더 URL
- 실제 Notion 페이지 URL
- 개인 Windows/Google Drive/Obsidian 절대 경로
- 실제 예약 자동화 ID
- 공개할 필요가 없는 실행 run_id / report_id
- 개인 수신자, 계정, 워크스페이스 정보

## 2. README에 남길 정보

README는 공개용 첫 화면이다.

남길 내용:

- 프로젝트 한 줄 소개
- 이 프로젝트가 아닌 것
- 핵심 철학
- 시스템 개요
- 주요 폴더 역할
- 주요 공개 문서 링크
- 테스트 방법
- 투자 권유가 아니라는 주의 문구

README에서 뺄 내용:

- 개인 링크
- 실제 예약 ID
- 너무 상세한 Apps Script 실행 단계
- 날짜별 live 검증 로그
- 개인 운영 경로
- 너무 긴 watchlist 분류 세부표

## 3. 운영 런북에 둘 정보

공개해도 되는 일반 운영 절차는 아래 문서에 둔다.

```text
docs/operations/weekly-lab-runbook.md
```

예:

- 어떤 파일을 Apps Script에 반영하는지
- 어떤 함수 순서로 실행하는지
- 문제가 생기면 어떤 로그 탭을 보는지
- 이메일 발송은 승인 후에만 해야 한다는 원칙

## 4. private 문서에 둘 정보

개인 운영 링크와 실제 경로는 아래 폴더에 둔다.

```text
docs/private/
```

이 폴더는 `.gitignore`에 포함되어 GitHub에 올라가지 않는다.

예:

```text
docs/private/operation-links.md
```

## 5. 이미 공개된 기록에 대한 주의

과거 커밋에 개인 링크가 들어간 적이 있다면, 현재 파일에서 삭제하더라도 Git 히스토리에는 남아 있을 수 있다.

민감도가 높은 정보가 들어갔다면 단순 삭제가 아니라 아래 조치가 필요할 수 있다.

- 링크 권한 비공개 확인
- 문서 ID 교체 또는 새 문서 생성
- Git 히스토리 정리 검토
- 공개 레포 접근 범위 재검토

현재 이 저장소에서는 우선 README와 현재 공개 문서에서 개인 링크를 제거하고, 실제 권한은 각 서비스에서 비공개로 유지하는 방식을 기본으로 한다.
