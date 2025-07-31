# Next.js 클라이언트 상태 관리 가이드

## 개요

Next.js는 서버 사이드 렌더링(SSR)과 클라이언트 사이드 렌더링(CSR)을 모두 지원하는 React 프레임워크입니다. 이러한 특성으로 인해 브라우저 API(예: localStorage, sessionStorage)를 사용할 때 주의가 필요합니다. 이 문서는 Next.js에서 클라이언트 상태를 안전하게 관리하는 방법을 설명합니다.

## 서버 사이드 렌더링 vs 클라이언트 사이드 렌더링

### 서버 사이드 렌더링 (SSR)
- 페이지가 서버에서 렌더링됨
- `window`, `document`, `localStorage` 등의 브라우저 API 사용 불가
- 초기 로딩 시 HTML이 완전히 생성되어 전달됨

### 클라이언트 사이드 렌더링 (CSR)
- 브라우저에서 JavaScript가 실행되며 렌더링됨
- 모든 브라우저 API 사용 가능
- hydration 과정을 통해 서버에서 렌더링된 HTML에 이벤트 리스너 등을 연결

## 상태 관리 전략

### 1. localStorage 접근 안전하게 처리하기

```typescript
// 안전한 localStorage 접근 함수
function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}
```

### 2. useState와 함께 사용하기

```typescript
// 컴포넌트에서 사용 예시
function UserProfile() {
  const [user, setUser] = useState(() => 
    getLocalStorageItem<User | null>('user', null)
  );
  
  // 사용자 정보 변경 시 localStorage 업데이트
  useEffect(() => {
    if (user) {
      setLocalStorageItem('user', user);
    }
  }, [user]);
  
  // ...
}
```

### 3. 커스텀 훅으로 만들기

```typescript
// useLocalStorage 훅
function useLocalStorage<T>(key: string, initialValue: T) {
  // 초기값 설정 (함수형 초기화)
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getLocalStorageItem(key, initialValue);
  });
  
  // 상태 업데이트 함수
  const setValue = (value: T | ((val: T) => T)) => {
    // 함수형 업데이트 지원
    const valueToStore = 
      value instanceof Function ? value(storedValue) : value;
    
    // 상태 업데이트
    setStoredValue(valueToStore);
    
    // localStorage 업데이트
    setLocalStorageItem(key, valueToStore);
  };
  
  return [storedValue, setValue] as const;
}

// 사용 예시
function UserProfile() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  
  // 이제 setUser를 호출하면 자동으로 localStorage도 업데이트됨
  // ...
}
```

## 페이지 새로고침 대응 전략

### 1. 로딩 상태 관리

```typescript
function ProfilePage() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 클라이언트 사이드 렌더링 완료 감지
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <UserProfileContent user={user} />;
}
```

### 2. 클라이언트 컴포넌트와 서버 컴포넌트 분리 (Next.js 13+)

```typescript
// ServerComponent.tsx (서버 컴포넌트)
export default function ServerComponent() {
  // 서버에서 데이터 가져오기
  // localStorage 사용 불가
  return <ClientComponent />;
}

// ClientComponent.tsx (클라이언트 컴포넌트)
'use client';

export default function ClientComponent() {
  // localStorage 사용 가능
  const [user, setUser] = useLocalStorage('user', null);
  // ...
}
```

### 3. Hydration 오류 방지

```typescript
// _app.tsx
export default function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 초기 SSR 렌더링과 CSR 렌더링의 불일치 방지
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}><Component {...pageProps} /></div>;
  }
  
  return <Component {...pageProps} />;
}
```

## 주요 고려사항

1. **보안**: localStorage에 민감한 정보(비밀번호, 토큰 등)를 저장할 때 보안 위험을 고려해야 함
2. **용량 제한**: localStorage는 도메인당 약 5MB 제한이 있음
3. **동기적 실행**: localStorage 작업은 메인 스레드를 차단할 수 있으므로 대량의 데이터 처리 시 주의 필요
4. **프라이빗 브라우징**: 사용자가 프라이빗 브라우징 모드를 사용하면 localStorage 접근이 제한될 수 있음

## 대안 검토

1. **쿠키**: 서버 사이드에서도 접근 가능하지만 요청마다 전송되므로 크기 제한에 주의
2. **상태 관리 라이브러리**: Redux, Zustand, Jotai 등과 localStorage를 함께 사용하여 영속성 제공
3. **Next.js 미들웨어**: 인증 정보 등을 관리하기 위해 미들웨어와 쿠키 활용

## 결론

Next.js에서 localStorage를 사용할 때는 서버 사이드 렌더링과 클라이언트 사이드 렌더링의 차이를 이해하고, 적절한 안전장치를 마련하는 것이 중요합니다. 함수형 초기화, useEffect를 통한 동기화, 커스텀 훅 등의 패턴을 활용하면 안전하고 효율적인 상태 관리가 가능합니다.
