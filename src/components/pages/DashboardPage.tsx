import React, { useState } from 'react';
import { TestMember } from '@/types/api';
import { attendanceService } from '@/api/attendanceService';
import Button from '@/components/common/Button';
import { getErrorMessage, formatDateKorean } from '@/utils/common';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardPageProps {
  currentMember: TestMember;
  todayDate: string;
  onViewAttendanceList: () => void;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  currentMember,
  todayDate,
  onViewAttendanceList,
  onLogout,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [checkInSuccess, setCheckInSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  // 오늘의 출석체크 진행
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      // 출석체크 등록 API 호출
      await attendanceService.createAttendance({ 
        testMemberId: currentMember.testMemberId 
      });
      
      // 성공 메시지 표시
      setCheckInSuccess(true);
      setMessage(`${formatDateKorean(new Date())} 출석체크가 완료되었습니다!`);
      setShowModal(true);
    } catch (err) {
      // 에러 메시지 표시
      setCheckInSuccess(false);
      setMessage(getErrorMessage(err));
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* 헤더 영역 */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
              <p className="text-lg text-gray-600 mt-1">
                안녕하세요, <span className="font-semibold text-indigo-600">{currentMember.testMemberName}</span>님!
              </p>
              <p className="text-sm text-gray-500">멤버 ID: {currentMember.testMemberId}</p>
            </div>
            <Button onClick={onLogout} variant="secondary" size="sm">
              로그아웃
            </Button>
          </div>
        </motion.div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 출석체크 카드 */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h2 className="text-white text-xl font-semibold">오늘의 출석체크</h2>
              <p className="text-indigo-100 text-sm">{formatDateKorean(new Date())}</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                오늘의 출석체크를 완료하고 활동 기록을 남겨보세요!
              </p>
              <Button
                onClick={handleCheckIn}
                loading={loading}
                variant="primary"
                className="w-full py-3 text-lg"
              >
                출석체크 하기
              </Button>
            </div>
          </motion.div>

          {/* 활동 메뉴 카드 */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          >
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
              <h2 className="text-white text-xl font-semibold">활동 메뉴</h2>
              <p className="text-blue-100 text-sm">출석 기록 및 커뮤니티 활동</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Button
                  onClick={onViewAttendanceList}
                  variant="secondary"
                  className="w-full py-3 text-lg flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  출석 기록 보기
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 출석체크 결과 모달 */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="text-center">
                  {checkInSuccess ? (
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                      <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                      <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {checkInSuccess ? '출석체크 성공!' : '출석체크 실패'}
                  </h3>
                  <p className="text-gray-500">{message}</p>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={closeModal}
                    className="w-full"
                    variant={checkInSuccess ? "success" : "error"}
                  >
                    확인
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
