# LogFit Backend

Spring Boot 기반 LogFit 백엔드 서비스입니다.

## 기술 스택

- Java 21
- Spring Boot 3.5.x
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- PostgreSQL
- Gradle

## 프로젝트 구조

```text
logfit-backend/
├─ src/main/java/com/bumsoo/logfit/
│  ├─ config/
│  ├─ controller/
│  ├─ dto/
│  ├─ entity/
│  ├─ repository/
│  ├─ security/
│  └─ service/
├─ src/main/resources/
│  └─ application.yaml
├─ src/test/
├─ build.gradle
└─ gradlew.bat
```

## 사전 준비

- Java 21
- Docker (PostgreSQL 실행 시)

## 데이터베이스 실행 (Docker)

현재 `src/main/resources/application.yaml` 기준 접속 정보:
- host: `localhost`
- port: `5432`
- db: `logfit`
- user: `logfit`
- password: `logfit123`

PowerShell:

```powershell
docker run -d --name logfit-postgres \
  -e POSTGRES_DB=logfit \
  -e POSTGRES_USER=logfit \
  -e POSTGRES_PASSWORD=logfit123 \
  -p 5432:5432 \
  postgres:16
```

## 로컬 실행

PowerShell:

```powershell
Set-Location "C:\bumsoo\logfit\logfit-backend"
.\gradlew.bat bootRun
```

기본 포트: `8080`  
기본 API base path: `/api`

예시:
- `http://localhost:8080/api/auth/login`
- `http://localhost:8080/api/auth/signup`

## 테스트 실행

PowerShell:

```powershell
Set-Location "C:\bumsoo\logfit\logfit-backend"
.\gradlew.bat test
```

## 주요 설정

`src/main/resources/application.yaml`

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `spring.jpa.hibernate.ddl-auto` (현재 `update`)
- `jwt.secret`

## 참고

- 개발 시 PostgreSQL이 떠 있지 않으면 백엔드 기동 시 DB 연결 오류가 발생할 수 있습니다.
- 테스트는 `src/test/resources/application.yaml` 기준(H2)으로 동작합니다.

