import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HomePage from '@/components/pages/HomePage';
import { TestMember } from '@/types/api';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    setIsLoading(false);
  }, []);

  // 멤버 선택 처리 (로그인)
  const handleMemberSelect = (member: TestMember) => {
    // 선택한 멤버 정보를 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentMember', JSON.stringify(member));
    }
    // 대시보드 페이지로 이동
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>출석체크 시스템</title>
        <meta name="description" content="출석체크 관리 시스템" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {isLoading ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-indigo-700 font-medium">로딩 중...</p>
          </div>
        </div>
      ) : (
        <HomePage onMemberSelect={handleMemberSelect} />
      )}
    </>
  );
}
