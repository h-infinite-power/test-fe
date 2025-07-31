# Next.js 페이지 새로고침 문제 해결 가이드

## 문제 상황

Next.js 애플리케이션에서 로컬 스토리지(localStorage)를 사용하여 사용자 상태를 관리할 때, 페이지 새로고침 시 다음과 같은 문제가 발생할 수 있습니다:

1. 페이지 새로고침 시 404 오류 발생
2. 로컬 스토리지의 데이터가 페이지 상태와 제대로 동기화되지 않음
3. 클라이언트 사이드 렌더링과 서버 사이드 렌더링 간의 차이로 인한 hydration 오류

## 해결 방법

### 1. 함수형 초기화를 사용한 useState 설정

```typescript
// ❌ 잘못된 방법: useEffect에서 로컬 스토리지 값을 가져와 상태 설정
const [currentMember, setCurrentMember] = useState<TestMember | null>(null);

useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedMember = localStorage.getItem('currentMember');
    if (storedMember) {
      setCurrentMember(JSON.parse(storedMember));
    }
  }
}, []);

// ✅ 권장 방법: 함수형 초기화를 사용한 상태 설정
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
```

### 2. 상태 변경 시 로컬 스토리지 업데이트

```typescript
// 상태가 변경될 때마다 로컬 스토리지에 저장
useEffect(() => {
  if (typeof window !== 'undefined' && currentMember) {
    localStorage.setItem('currentMember', JSON.stringify(currentMember));
  }
}, [currentMember]);
```

### 3. 클라이언트 사이드 렌더링 감지 및 관리

```typescript
// _app.tsx에서 클라이언트 사이드 렌더링 감지
import { useEffect, useState, CSSProperties } from 'react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    setMounted(true);
  }, []);

  // React hydrate 완료 전에는 컨텐츠를 숨김 처리
  const style: CSSProperties = !mounted ? { visibility: 'hidden' as const } : {};

  return (
    <div style={style}>
      <Component {...pageProps} />
    </div>
  );
}
```

### 4. 안전한 로딩 상태 관리

```typescript
// 페이지 컴포넌트에서 로딩 상태 관리
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // 클라이언트 사이드 렌더링 완료 감지
  setIsLoading(false);
}, []);

// 로딩 중이거나 필요한 데이터가 없을 때 로딩 UI 표시
if (isLoading || !currentMember) {
  return <LoadingUI />;
}
```

## 핵심 요소

1. **초기 상태 설정**: useState의 함수형 초기화를 사용하여 로컬 스토리지 값을 초기 상태로 설정
2. **상태 유지**: 상태가 변경될 때마다 로컬 스토리지에 동기화
3. **안전한 액세스**: 항상 `typeof window !== 'undefined'` 체크를 통해 서버 사이드 렌더링에서 오류 방지
4. **예외 처리**: try-catch 블록을 사용하여 로컬 스토리지 데이터 파싱 오류 처리
5. **hydration 관리**: 클라이언트 사이드 렌더링이 완료될 때까지 콘텐츠를 숨기거나 적절한 로딩 UI 표시

## 주의사항

1. 로컬 스토리지는 클라이언트 사이드에서만 접근 가능하므로, 서버 사이드 렌더링 시에는 데이터가 없음
2. 사용자가 브라우저 캐시나 로컬 스토리지를 지울 경우 데이터가 손실될 수 있음
3. 민감한 정보는 로컬 스토리지에 저장하지 않는 것이 좋음

## 서버 컴포넌트 환경에서의 고려사항 (Next.js 13+ App Router)

Next.js 13 이상의 App Router를 사용하는 경우, 서버 컴포넌트와 클라이언트 컴포넌트를 구분하여 처리해야 합니다:

```typescript
'use client'; // 클라이언트 컴포넌트 지정

// 로컬 스토리지 접근은 클라이언트 컴포넌트에서만 가능
```

서버 컴포넌트에서는 쿠키나 세션을 통한 상태 관리를 고려하는 것이 좋습니다.
