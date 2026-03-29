# LogFit Frontend

운동 기록 서비스 LogFit의 프론트엔드입니다.

## 📋 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트

## 🚀 시작하기

### 1. 프로젝트 설치

```bash
cd C:\bumsoo\logfit-frontend
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 3. 프로덕션 빌드

```bash
npm run build
```

## 📁 프로젝트 구조

```
logfit-frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx       # 로그인 화면
│   │   ├── SignupForm.tsx      # 회원가입 화면
│   │   └── Dashboard.tsx       # 사용자 대시보드
│   ├── services/
│   │   └── api.ts              # API 통신 설정
│   ├── App.tsx                 # 라우팅 설정
│   ├── main.tsx                # 엔트리 포인트
│   └── index.css               # 전역 스타일
├── index.html                  # HTML 템플릿
├── package.json                # 프로젝트 설정
├── tsconfig.json               # TypeScript 설정
├── vite.config.ts              # Vite 설정
├── tailwind.config.js          # Tailwind 설정
└── .env                        # 환경 변수
```

## 🔐 인증 흐름

1. **회원가입** (`/signup`)
   - 사용자명, 이메일, 비밀번호 입력
   - 백엔드에서 유효성 검사
   - 성공 시 로그인 페이지로 이동

2. **로그인** (`/login`)
   - 이메일, 비밀번호 입력
   - Access Token & Refresh Token 발급
   - localStorage에 토큰 저장
   - 대시보드로 이동

3. **보호된 API** (`/dashboard`)
   - Authorization 헤더에 토큰 포함
   - 토큰 만료 시 자동으로 갱신
   - 토큰 갱신 실패 시 로그인 페이지로 이동

## 🛠️ 백엔드 연동

### API 엔드포인트

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/users/me` - 현재 사용자 조회
- `PUT /api/users/me` - 사용자 정보 수정

### 환경 변수

`.env` 파일에서 백엔드 URL 설정:

```
VITE_API_URL=http://localhost:8080/api
```

## ✨ 주요 기능

- ✅ 회원가입 (유효성 검사 포함)
- ✅ 로그인 (JWT 토큰)
- ✅ 자동 토큰 갱신
- ✅ 사용자 프로필 조회 및 수정
- ✅ 로그아웃

## 🚧 추가 예정 기능

- 운동 기록 CRUD
- 운동 통계
- 운동 계획
- 사진 업로드

## 🐛 문제 해결

### Proxy 설정

Vite에서 백엔드 API 프록시가 설정되어 있습니다 (`vite.config.ts`).

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

### CORS 이슈

백엔드에서 CORS가 허용되어 있으므로 문제가 없어야 합니다.

## 📝 라이선스

MIT

