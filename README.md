before_login/
│
│
├── backend/                    # Node.js/Express 백엔드 코드
│   ├── server.js                   # 서버 설정 및 실행 파일
│   ├── routes/                 # Express 라우트 디렉터리
│   │   └── envCheck.js            # 환경 정보 체크 라우트 !!
│   ├── controllers/            # 비즈니스 로직을 처리하는 컨트롤러
│   │   └── envController.js       # 환경 체크 처리 !!
│   ├── models/                 # MySQL 모델
│   │   └── Policy.js               # 정책 검증 모델 !!
│   ├── config/                 # 데이터베이스 및 기타 설정 파일
│   │   └── db.js                   # MySQL 연결 설정
│   └── package.json            # 백엔드 의존성 및 실행 스크립트
│
│
├── frontend/                # React 프론트엔드 코드
│   ├── src/
│   │   ├── components/         # 컴포넌트 폴더
│   │   │   └── login_page.js       # 로그인 직전 페이지 컴포넌트 !!
│   │   ├── services/           # API 호출 관련 서비스
│   │   │   └── api.js              # 백엔드와의 통신을 위한 API 설정 !!
│   │   ├── App.js                  # 메인 React 컴포넌트
│   │   ├── index.js                # React 앱의 엔트리 포인트
│   └── package.json            # 프론트엔드 의존성 및 실행 스크립트
│
└── README.md                   # 프로젝트 설명 파일