import React, { useState, useEffect, useMemo } from 'react';
import { TestAttendance, TestMember } from '@/types/api';
import { attendanceService } from '@/api/attendanceService';
import { memberService } from '@/api/memberService';
import Button from '@/components/common/Button';
import { getErrorMessage, formatDateKorean } from '@/utils/common';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/common/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

interface AttendanceListPageProps {
  currentMember: TestMember;
  onAttendanceSelect: (attendanceId: string) => void; // number에서 string으로 변경
  onBack: () => void;
}

const ITEMS_PER_PAGE = 5;

const AttendanceListPage: React.FC<AttendanceListPageProps> = ({
  currentMember,
  onAttendanceSelect,
  onBack,
}) => {
  const [attendances, setAttendances] = useState<TestAttendance[]>([]);
  const [members, setMembers] = useState<TestMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    loadAttendances();
    loadMembers();
  }, []);

  const loadAttendances = async () => {
    try {
      setLoading(true);
      setError('');
      const attendanceList = await attendanceService.getAllAttendances();
      setAttendances(attendanceList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 모든 멤버 정보 로드
  const loadMembers = async () => {
    try {
      const memberList = await memberService.getAllMembers();
      setMembers(memberList);
    } catch (err) {
      console.error('멤버 목록을 불러오는 중 오류가 발생했습니다:', err);
    }
  };

  const handleAttendanceClick = (attendanceId: string) => {
    console.log('클릭한 출석 ID:', attendanceId); // 디버깅 로그 추가
    onAttendanceSelect(attendanceId);
  };

  const handleRefresh = () => {
    loadAttendances();
    loadMembers();
    setSelectedDate(null);
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setDateFilter(formattedDate);
    } else {
      setDateFilter('');
    }
  };  // 달력 토글
  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };
  
  // 달력 외부 클릭 처리
  const calendarRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 날짜 포맷 (YYYY-MM-DD)
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 선택된 날짜 표시
  const getSelectedDateFormatted = (): string => {
    if (!dateFilter) return '전체 날짜';
    return formatDateKorean(dateFilter);
  };
  
  // 날짜 필터 초기화
  const clearDateFilter = () => {
    setSelectedDate(null);
    setDateFilter('');
  };

  // memberId로 memberName 찾기
  const getMemberNameById = (memberId: number): string => {
    const member = members.find(m => m.testMemberId === memberId);
    return member ? member.testMemberName : '알 수 없음';
  };

  // 필터링 및 정렬된 출석 데이터
  const filteredAttendances = useMemo(() => {
    return attendances
      .filter(attendance => {
        // 멤버 이름으로 검색 필터링
        const memberNameFilter = !searchTerm || 
          getMemberNameById(attendance.testMemberId).toLowerCase().includes(searchTerm.toLowerCase());
        
        // 날짜 필터링
        const dateFilterMatch = !dateFilter || 
          attendance.testAttendanceDate === dateFilter;
        
        return memberNameFilter && dateFilterMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.testAttendanceDate).getTime();
        const dateB = new Date(b.testAttendanceDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [attendances, members, searchTerm, sortOrder, dateFilter]);

  // 페이지네이션 로직
  const totalPages = Math.ceil(filteredAttendances.length / ITEMS_PER_PAGE);
  
  const paginatedAttendances = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAttendances.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAttendances, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 상단으로 부드럽게 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 정렬 순서 토글
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading && attendances.length === 0) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"
            animate={{ 
              rotate: 360 
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          ></motion.div>
          <motion.p 
            className="mt-6 text-indigo-700 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            출석 목록을 불러오는 중...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <motion.div 
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">출석체크 기록</h1>
              <p className="text-indigo-600 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {currentMember.testMemberName}님의 출석 기록
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleRefresh} 
                loading={loading} 
                variant="secondary"
                className="flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                새로고침
              </Button>
              <Button onClick={onBack} variant="primary" className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                대시보드
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 필터 및 검색 */}
        <motion.div 
          className="bg-white rounded-xl shadow-soft p-6 mb-6"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Input
                type="text"
                placeholder="멤버 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* 달력 필터 */}
            <div className="relative">
              <button 
                onClick={toggleCalendar}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  dateFilter 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                } transition-colors`}
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {getSelectedDateFormatted()}
                {dateFilter && (
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              
              {showCalendar && (
                <div ref={calendarRef} className="absolute mt-2 right-0 z-10 bg-white rounded-lg shadow-lg p-4">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">날짜 선택</span>
                    <button 
                      onClick={() => handleDateSelect(null)} 
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      전체 날짜 보기
                    </button>
                  </div>
                  <DatePicker 
                    selected={selectedDate}
                    onChange={(date) => handleDateSelect(date)}
                    inline
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    className="border-none"
                  />
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleSortOrder}
              className="flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {sortOrder === 'desc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                )}
              </svg>
              {sortOrder === 'desc' ? '최신순' : '오래된순'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 flex flex-wrap justify-between items-center">
            <div>
              {filteredAttendances.length > 0 
                ? `전체 ${filteredAttendances.length}개의 출석 기록 중 ${paginatedAttendances.length}개 표시`
                : '출석 기록이 없습니다.'}
            </div>
            
            {dateFilter && (
              <div className="flex items-center text-indigo-600 mt-2 md:mt-0">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDateKorean(dateFilter)} 기준 필터링 중</span>
                <button 
                  onClick={clearDateFilter}
                  className="ml-2 text-xs bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full"
                >
                  초기화
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* 에러 메시지 */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-error-100 border-l-4 border-error-500 rounded-md shadow-soft"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-error-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 출석 목록 */}
        {filteredAttendances.length === 0 ? (
          <motion.div 
            className="bg-white rounded-xl shadow-soft p-12 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">출석체크 기록이 없습니다.</p>
            {searchTerm && (
              <p className="text-gray-400 mt-2">검색어: "{searchTerm}"에 대한 결과가 없습니다.</p>
            )}
            <div className="mt-4 flex justify-center space-x-3">
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="secondary">
                  검색 초기화
                </Button>
              )}
              <Button onClick={onBack} variant="primary">
                대시보드로 돌아가기
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`page-${currentPage}-${sortOrder}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                {paginatedAttendances.map((attendance, index) => (
                  <motion.div
                    key={attendance.testAttendanceId}
                    className="bg-white rounded-xl shadow-soft p-6 hover:shadow-hard transition-all cursor-pointer"
                    onClick={() => handleAttendanceClick(attendance.testAttendanceId)}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                    whileHover={{ 
                      scale: 1.01, 
                      backgroundColor: '#FAFBFF',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              출석체크 #{attendance.testAttendanceId}
                            </h3>
                            <p className="text-indigo-600 font-medium">
                              {formatDateKorean(attendance.testAttendanceDate)}
                            </p>
                            <p className="text-gray-500 text-sm">
                              멤버: {getMemberNameById(attendance.testMemberId)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center space-x-6 bg-gray-50 px-4 py-2 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600 flex items-center">
                              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              {attendance.testLikesCount}
                            </div>
                            <div className="text-xs text-gray-500">좋아요</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-success-600 flex items-center">
                              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                              {attendance.testCommentsCount}
                            </div>
                            <div className="text-xs text-gray-500">댓글</div>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            size="sm" 
                            variant="primary" 
                            className="ml-4"
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 버블링 방지
                              handleAttendanceClick(attendance.testAttendanceId);
                            }}
                          >
                            상세보기
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                    } transition-colors shadow-sm`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-indigo-50'
                      } transition-colors shadow-sm`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                    } transition-colors shadow-sm`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AttendanceListPage;
