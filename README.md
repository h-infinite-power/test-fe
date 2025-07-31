# 출석체크 시스템 Frontend

Next.js + React + TypeScript + Tailwind CSS로 구현된 출석체크 시스템의 프론트엔드입니다.

## 기능

### 🏠 홈페이지 (/)
- **멤버 추가**: 이름을 입력하여 새로운 멤버를 등록할 수 있습니다
- **멤버 선택**: 기존 멤버 목록에서 멤버를 선택하여 출석체크할 수 있습니다
- **멤버 검색**: 이름으로 멤버를 검색할 수 있습니다

### 📋 출석체크 목록
- 전체 출석체크 기록을 조회할 수 있습니다
- 각 출석체크별 좋아요 수와 댓글 수를 확인할 수 있습니다
- 출석 날짜와 멤버 정보를 확인할 수 있습니다

### 📝 출석체크 상세
- 특정 출석체크의 상세 정보를 조회할 수 있습니다
- **좋아요 기능**: 출석체크에 좋아요를 추가하거나 취소할 수 있습니다
- **댓글 기능**: 댓글을 등록, 수정, 삭제할 수 있습니다
- 좋아요를 누른 사람들의 목록을 확인할 수 있습니다

## 기술 스택

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)

## 프로젝트 구조

```
src/
├── api/                    # API 클라이언트 및 서비스
│   ├── client.ts          # Axios 클라이언트 설정
│   ├── memberService.ts   # 멤버 관련 API
│   └── attendanceService.ts # 출석 관련 API
├── components/            # React 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   │   ├── Button.tsx    # 버튼 컴포넌트
│   │   ├── Input.tsx     # 입력 컴포넌트
│   │   └── Select.tsx    # 셀렉트 컴포넌트
│   └── pages/            # 페이지 컴포넌트
│       ├── HomePage.tsx           # 홈페이지
│       ├── AttendanceListPage.tsx # 출석 목록 페이지
│       └── AttendanceDetailPage.tsx # 출석 상세 페이지
├── pages/                # Next.js 페이지
│   ├── _app.tsx         # App 컴포넌트
│   ├── _document.tsx    # Document 컴포넌트
│   └── index.tsx        # 메인 페이지
├── styles/              # 스타일 파일
│   └── globals.css      # 전역 스타일
├── types/               # TypeScript 타입 정의
│   └── api.ts          # API 관련 타입
├── utils/               # 유틸리티 함수
│   ├── common.ts       # 공통 유틸리티
│   └── dateUtils.ts    # 날짜 관련 유틸리티
└── App.tsx             # 메인 앱 컴포넌트
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일에서 API 서버 URL을 설정하세요:

```env
API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 http://localhost:3000에서 실행됩니다.

### 4. 빌드

```bash
npm run build
```

### 5. 프로덕션 실행

```bash
npm run start
```

## API 연동

이 프론트엔드는 다음 REST API 엔드포인트를 사용합니다:

### 멤버 API
- `POST /test-api/test-members` - 멤버 등록
- `GET /test-api/test-members` - 멤버 전체 조회
- `GET /test-api/test-members/{id}` - 멤버 상세 조회
- `PUT /test-api/test-members/{id}` - 멤버 수정
- `DELETE /test-api/test-members/{id}` - 멤버 삭제

### 출석체크 API
- `POST /test-api/test-attendances` - 출석체크 등록
- `GET /test-api/test-attendances` - 출석체크 전체 조회
- `GET /test-api/test-attendances/{id}` - 출석체크 상세 조회
- `DELETE /test-api/test-attendances/{id}` - 출석체크 삭제

### 좋아요 & 댓글 API
- `POST /test-api/test-attendances/{id}/test-likes` - 좋아요 추가
- `DELETE /test-likes/{id}` - 좋아요 취소
- `POST /test-api/test-attendances/{id}/test-comments` - 댓글 등록
- `PUT /test-api/test-comments/{id}` - 댓글 수정
- `DELETE /test-api/test-comments/{id}` - 댓글 삭제

## 주요 특징

### 🎨 반응형 디자인
- Tailwind CSS를 사용한 반응형 디자인
- 모바일 친화적인 UI/UX

### 🔄 실시간 데이터 업데이트
- 좋아요, 댓글 등의 액션 후 자동으로 데이터 새로고침
- 사용자 친화적인 로딩 상태 표시

### ⚡ 성능 최적화
- TypeScript를 통한 타입 안정성
- 컴포넌트 기반 구조로 재사용성 극대화
- Next.js의 최적화 기능 활용

### 🎯 사용자 경험
- 직관적인 네비게이션
- 명확한 피드백 메시지
- 키보드 단축키 지원 (Enter 키로 폼 제출)

## 개발 가이드

### 새로운 컴포넌트 추가
1. `src/components/` 디렉토리에 새 컴포넌트 파일 생성
2. TypeScript 인터페이스로 props 정의
3. Tailwind CSS 클래스를 사용한 스타일링

### API 연동 확장
1. `src/types/api.ts`에 새로운 타입 정의 추가
2. `src/api/`에 새로운 서비스 파일 생성
3. 에러 핸들링 및 로딩 상태 관리

### 상태 관리
- 현재는 React의 `useState`와 `useEffect` 훅 사용
- 필요시 Redux 또는 Zustand 등의 상태 관리 라이브러리 도입 가능

## 배포

### Vercel 배포 (권장)
1. Vercel 계정에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 완료

### 기타 플랫폼
- Netlify, AWS Amplify 등에서도 배포 가능
- `npm run build` 후 생성된 `out` 폴더를 정적 호스팅

## 문제 해결

### 일반적인 문제들

1. **API 연결 오류**
   - `.env.local` 파일의 API_BASE_URL 확인
   - 백엔드 서버가 실행 중인지 확인

2. **빌드 오류**
   - `node_modules` 삭제 후 `npm install` 재실행
   - TypeScript 오류 확인 및 수정

3. **스타일링 문제**
   - Tailwind CSS 설정 확인
   - `globals.css` 파일 import 확인

## 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새 기능 추가'`)
4. 브랜치에 푸시합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
