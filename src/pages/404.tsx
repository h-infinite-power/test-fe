import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();
  
  useEffect(() => {
    // 3초 후 홈페이지로 자동 리다이렉션
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="h-24 w-24 text-indigo-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">404 에러</h1>
        <p className="text-gray-600 mb-6">
          요청하신 페이지를 찾을 수 없습니다.<br />
          <span className="text-sm">3초 후 자동으로 홈페이지로 이동합니다.</span>
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors w-full"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
