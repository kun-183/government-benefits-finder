# 정부 혜택 찾기 웹앱

대한민국 정부 혜택(공공서비스)을 찾아주는 웹 애플리케이션입니다.
사용자가 혜택, 지원금, 정부 사업, 대상, 조건을 물어보면 공공데이터포털 API를 통해 최신 정보를 조회하여 제공합니다.

## 주요 기능

- 청년정책 정보 검색
- 정책 분야별 필터링 (일자리, 주거, 교육, 복지·문화, 참여·권리)
- 정책 유형별 필터링 (지원사업, 일자리, 상담, 정책자금, 시설·공간)
- 정책 상세 정보 조회
- 반응형 웹 디자인 (모바일/태블릿/데스크톱 지원)

## 기술 스택

### Frontend
- React 18
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- xml2js (XML 응답 파싱)

### API
- 공공데이터포털 청년정책 API

## 설치 및 실행 방법

### 1. 저장소 클론
```bash
cd government-benefits-finder
```

### 2. 공공데이터포털 API 키 발급
1. [공공데이터포털](https://www.data.go.kr/)에 접속
2. 회원가입 및 로그인
3. "한국청소년정책연구원_청년정책 정보" API 검색
4. 활용신청 후 API 키 발급 (승인까지 1-2시간 소요)

### 3. 환경 변수 설정
```bash
# server/.env 파일 생성
cd server
cp .env.example .env
```

`.env` 파일을 열어 발급받은 API 키를 입력:
```env
YOUTH_POLICY_API_KEY=발급받은_API_키
PORT=5000
```

### 4. 의존성 설치
```bash
# 루트 디렉토리에서
npm run install-all
```

또는 개별 설치:
```bash
# 루트
npm install

# 서버
cd server
npm install

# 클라이언트
cd ../client
npm install
```

### 5. 애플리케이션 실행
```bash
# 루트 디렉토리에서 (서버와 클라이언트 동시 실행)
npm run dev
```

또는 개별 실행:
```bash
# 서버만 실행 (터미널 1)
cd server
npm run dev

# 클라이언트만 실행 (터미널 2)
cd client
npm start
```

### 6. 접속
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000

## API 엔드포인트

### 청년정책 목록 조회
```
GET /api/youth-policies
```
Query Parameters:
- `keyword`: 검색 키워드
- `srchPolyBizSecd`: 정책 분야 코드
- `bizTycdSel`: 정책 유형 코드
- `pageIndex`: 페이지 번호
- `display`: 페이지당 결과 수

### 청년정책 상세 조회
```
GET /api/youth-policies/:id
```

### 정책 분야 목록
```
GET /api/policy-categories
```

### 정책 유형 목록
```
GET /api/policy-types
```

### 서버 상태 확인
```
GET /health
```

## 프로젝트 구조

```
government-benefits-finder/
├── client/                 # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   │   ├── SearchBar.js
│   │   │   ├── FilterSection.js
│   │   │   ├── PolicyList.js
│   │   │   └── PolicyDetail.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── server/                # Express 백엔드
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## 주의사항

1. API 키는 절대 GitHub에 올리지 마세요 (.gitignore에 .env 포함)
2. API 키 승인 후 사용 가능 (승인 전 오류 발생)
3. 공공데이터 API는 일일 트래픽 제한이 있을 수 있습니다
4. CORS 설정이 되어있어 localhost에서만 작동합니다

## 배포

### 프론트엔드 빌드
```bash
cd client
npm run build
```

### 백엔드 프로덕션 실행
```bash
cd server
npm start
```

## 문제 해결

### API 키 오류
- `.env` 파일이 `server/` 디렉토리에 있는지 확인
- API 키 승인 여부 확인
- API 키 값에 따옴표가 없는지 확인

### CORS 오류
- 백엔드 서버가 실행 중인지 확인
- 클라이언트와 서버 포트 확인 (3000, 5000)

### 빌드 오류
- Node.js 버전 확인 (v14 이상 권장)
- `node_modules` 삭제 후 재설치

## 라이선스

MIT License

## 데이터 출처

한국청소년정책연구원 청년정책 정보 (공공데이터포털)
