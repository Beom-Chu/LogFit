# LogFit

운동 기록 서비스 `LogFit`의 모노레포입니다.

- 백엔드: Spring Boot (`logfit-backend`)
- 프론트엔드: React + Vite (`logfit-frontend`)

## 프로젝트 구조

```text
logfit/
├─ logfit-backend/
└─ logfit-frontend/
```

## 사전 준비

- Java 21
- Node.js 18+
- Docker (PostgreSQL 실행용)

## 1) PostgreSQL 실행 (Docker)

`logfit-backend/src/main/resources/application.yaml` 기준 DB 접속 정보:
- DB: `logfit`
- USER: `logfit`
- PASSWORD: `logfit123`
- PORT: `5432`

```powershell
docker run -d --name logfit-postgres -e POSTGRES_DB=logfit -e POSTGRES_USER=logfit -e POSTGRES_PASSWORD=logfit123 -p 5432:5432 postgres:16
```

## 2) 백엔드 실행

```powershell
Set-Location "C:\bumsoo\logfit\logfit-backend"
.\gradlew.bat bootRun
```

기본 API 주소: `http://localhost:8080/api`

## 3) 프론트엔드 실행

프론트에서 백엔드 API를 명시하려면 `logfit-frontend/.env`에 아래를 설정하세요.

```env
VITE_API_URL=http://localhost:8080/api
```

```powershell
Set-Location "C:\bumsoo\logfit\logfit-frontend"
npm install
npm run dev
```

Vite 기본 접속 주소: `http://localhost:5173`

## 빠른 검증

백엔드 테스트:

```powershell
Set-Location "C:\bumsoo\logfit\logfit-backend"
.\gradlew.bat test
```

프론트 빌드:

```powershell
Set-Location "C:\bumsoo\logfit\logfit-frontend"
npm run build
```

## GitHub 업로드

```powershell
Set-Location "C:\bumsoo\logfit"
git init
git add .
git commit -m "Initial commit: logfit monorepo"
git branch -M main
git remote add origin https://github.com/<your-id>/<repo-name>.git
git push -u origin main
```

이미 `origin`이 있으면 아래로 변경:

```powershell
git remote set-url origin https://github.com/<your-id>/<repo-name>.git
```

