import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되는 코드
    setMounted(true);
  }, []);

  // 초기 SSR 렌더링 시에는 컴포넌트를 정상적으로 렌더링하고
  // 클라이언트에서 hydration이 완료된 후에 mounted 상태 업데이트
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
