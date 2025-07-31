# Next.js 프로젝트 새로고침 문제 해결 사례

## 프로젝트 구조 및 문제 상황

본 프로젝트는 Next.js로 개발된 출석체크 애플리케이션으로, 다음과 같은 페이지들이 있습니다:

1. `/` (홈): 로그인 페이지
2. `/dashboard`: 사용자 대시보드
3. `/attendance-list`: 출석 목록 페이지
4. `/attendance-detail/[id]`: 출석 상세 정보 페이지

사용자 인증을 위해 localStorage에 `currentMember` 정보를 저장하고 있었으나, 페이지 새로고침 시 다음과 같은 문제가 발생했습니다:

- 페이지 새로고침 시 404 오류 발생
- 인증된 사용자 정보가 손실되어 로그인 페이지로 리다이렉트됨
- hydration 관련 경고 메시지 발생

## 해결 과정

### 1. 문제 분석

기존 코드에서는 다음과 같은 문제점이 발견되었습니다:

1. localStorage 접근이 클라이언트 사이드에서만 가능한데, 초기 렌더링 시점에 바로 접근하려고 함
2. useState의 초기값을 null로 설정하고, useEffect에서 나중에 값을 가져오는 방식
3. 상태 변경 시 localStorage 업데이트 로직 부재
4. 클라이언트/서버 렌더링 간 차이를 고려하지 않은 구조

### 2. 적용한 해결책

#### 2.1 _app.tsx 수정

```tsx
// 변경 전
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// 변경 후
export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const style: CSSProperties = !mounted ? { visibility: 'hidden' as const } : {};

  return (
    <ErrorBoundary>
      <div style={style}>
        <Component {...pageProps} />
      </div>
    </ErrorBoundary>
  );
}
```

#### 2.2 페이지 컴포넌트 수정 (예: attendance-detail/[id].tsx)

```tsx
// 변경 전
const [currentMember, setCurrentMember] = useState<TestMember | null>(null);

useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedMember = localStorage.getItem('currentMember');
    if (storedMember) {
      try {
        setCurrentMember(JSON.parse(storedMember));
      } catch (error) {
        console.error('Failed to parse member data:', error);
        localStorage.removeItem('currentMember');
      }
    }
    setIsLoading(false);
  }
}, []);

// 변경 후
const [currentMember, setCurrentMember] = useState<TestMember | null>(() => {
  if (typeof window !== 'undefined') {
    try {
      const storedMember = localStorage.getItem('currentMember');
      return storedMember ? JSON.parse(storedMember) : null;
    } catch (error) {
      console.error('Failed to parse member data:', error);
      return null;
    }
  }
  return null;
});

// 클라이언트 사이드 렌더링 감지
useEffect(() => {
  setIsLoading(false);
}, []);

// 현재 멤버 상태가 변경될 때 localStorage 업데이트
useEffect(() => {
  if (typeof window !== 'undefined' && currentMember) {
    localStorage.setItem('currentMember', JSON.stringify(currentMember));
  }
}, [currentMember]);
```

#### 2.3 로딩 상태 관리 개선

```tsx
// 로딩 상태 추가
const [isLoading, setIsLoading] = useState(true);

// 로딩 중이거나 필요한 데이터가 없을 때 로딩 UI 표시
if (isLoading || !currentMember || !id) {
  return (
    <>
      <Head>
        <title>출석체크 상세 | 로딩 중...</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-700 font-medium">로딩 중...</p>
        </div>
      </div>
    </>
  );
}
```

#### 2.4 로그아웃 처리 개선

```tsx
// 변경 전
const handleLogout = () => {
  localStorage.removeItem('currentMember');
  router.push('/');
};

// 변경 후
const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentMember');
    setCurrentMember(null); // 상태도 함께 초기화
  }
  router.push('/');
};
```

## 최종 결과

위와 같은 변경 사항을 적용한 후 다음과 같은 개선이 이루어졌습니다:

1. 페이지 새로고침 시 404 오류가 더 이상 발생하지 않음
2. 로컬 스토리지 데이터가 상태와 동기화되어 사용자 인증 정보가 유지됨
3. 클라이언트 사이드 렌더링 시 화면 깜빡임이나 hydration 오류가 줄어듦
4. 예외 상황(잘못된 데이터, 서버 사이드 렌더링 등)에 대한 안전한 처리

## 권장 사항

1. **useState 함수형 초기화 사용**: 초기값을 설정할 때 함수형 초기화를 사용하여 로컬 스토리지 값을 바로 가져옴
2. **상태 변경 시 localStorage 업데이트**: 상태가 변경될 때마다 로컬 스토리지 값을 업데이트하는 useEffect 추가
3. **try-catch로 오류 처리**: 데이터 파싱 오류 등에 대비하여 예외 처리 로직 구현
4. **클라이언트 사이드 렌더링 감지**: 초기 렌더링과 클라이언트 사이드 렌더링을 구분하여 처리
5. **적절한 로딩 UI 제공**: 데이터 로딩 중이거나 누락된 경우 사용자에게 적절한 피드백 제공

이러한 패턴을 일관되게 적용하면 Next.js 애플리케이션에서 localStorage를 사용할 때 발생할 수 있는 새로고침 관련 문제를 효과적으로 해결할 수 있습니다.
