import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AttendanceDetailPage from '@/components/pages/AttendanceDetailPage';
import { TestMember } from '@/types/api';
import Head from 'next/head';

const AttendanceDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // localStorage에서 초기값을 가져오는 함수형 초기화
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
  
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (!isLoading && !currentMember) {
      router.push('/');
    } else if (id) {
      console.log('출석 상세 페이지 ID 파라미터:', id); // 디버깅 로그 추가
    }
  }, [currentMember, isLoading, router, id]);

  // 출석 목록으로 돌아가기
  const handleBack = () => {
    router.push('/attendance-list');
  };

  // 로딩 중이거나 멤버가 없거나 ID가 없으면 로딩 화면 표시
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

  return (
    <>
      <Head>
        <title>출석체크 상세</title>
      </Head>
      {id && (
        <AttendanceDetailPage
          attendanceId={String(id)}
          currentMember={currentMember}
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default AttendanceDetail;
