import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AttendanceListPage from '@/components/pages/AttendanceListPage';
import { TestMember } from '@/types/api';
import Head from 'next/head';

const AttendanceList = () => {
  const router = useRouter();
  
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
    // 로딩이 완료되고 로그인 상태가 아니면 홈으로 리다이렉트
    if (!isLoading && !currentMember) {
      router.push('/');
    }
  }, [currentMember, isLoading, router]);

  // 출석 상세 페이지로 이동
  const handleAttendanceSelect = (attendanceId: string) => {
    console.log('이동할 출석 상세 ID:', attendanceId); // 디버깅 로그 추가
    router.push(`/attendance-detail/${attendanceId}`);
  };

  // 대시보드로 돌아가기
  const handleBack = () => {
    router.push('/dashboard');
  };

  // 로딩 중이거나 멤버가 없으면 로딩 화면 표시
  if (isLoading || !currentMember) {
    return (
      <>
        <Head>
          <title>출석체크 목록 | 로딩 중...</title>
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
        <title>출석체크 목록</title>
      </Head>
      <AttendanceListPage
        currentMember={currentMember}
        onAttendanceSelect={handleAttendanceSelect}
        onBack={handleBack}
      />
    </>
  );
};

export default AttendanceList;
