import React, { useState, useEffect } from 'react';
import { TestMember } from '@/types/api';
import { memberService } from '@/api/memberService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { getErrorMessage, isEmpty } from '@/utils/common';
import { motion } from 'framer-motion';

interface HomePageProps {
  onMemberSelect: (member: TestMember) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onMemberSelect }) => {
  const [members, setMembers] = useState<TestMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // 멤버 목록 조회
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const memberList = await memberService.getAllMembers();
      setMembers(memberList);
    } catch (err) {
      console.error('멤버 목록 로딩 중 오류 발생:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 멤버 추가
  const handleAddMember = async () => {
    if (isEmpty(newMemberName)) {
      setError('이름을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await memberService.createMember({ testMemberName: newMemberName.trim() });
      setNewMemberName('');
      setSuccess('멤버가 성공적으로 추가되었습니다.');
      await loadMembers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 멤버 선택 (접속만 처리)
  const handleMemberSelect = () => {
    if (!selectedMemberId) {
      setError('멤버를 선택해주세요.');
      return;
    }

    const selectedMember = members.find(m => m.testMemberId.toString() === selectedMemberId);
    if (!selectedMember) {
      setError('선택된 멤버를 찾을 수 없습니다.');
      return;
    }

    // 선택한 멤버로 로그인 처리 (대시보드로 이동)
    onMemberSelect(selectedMember);
  };

  // 검색된 멤버 목록 - 검색어가 변경될 때마다 필터링
  const filteredMembers = members.filter(member =>
    searchTerm === '' || member.testMemberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 멤버 옵션 목록 생성
  const memberOptions = filteredMembers.map(member => ({
    value: member.testMemberId.toString(),
    label: member.testMemberName,
  }));
  
  // 검색어가 변경되면 선택된 멤버 ID 초기화
  useEffect(() => {
    setSelectedMemberId('');
  }, [searchTerm]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">출석체크 시스템</h1>
          <p className="text-indigo-600">로그인하여 출석체크를 시작하세요.</p>
        </motion.div>

        {/* 알림 메시지 */}
        {error && (
          <motion.div 
            className="mb-4 p-4 bg-error-100 border-l-4 border-error-500 rounded-md shadow-soft"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
        
        {success && (
          <motion.div 
            className="mb-4 p-4 bg-success-100 border-l-4 border-success-500 rounded-md shadow-soft"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-success-700 text-sm font-medium">{success}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 타이틀 카드 */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-hard p-6 mb-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">오늘도 좋은 하루 되세요!</h2>
          <p className="mt-2 text-indigo-100">로그인 후 오늘의 출석을 체크할 수 있습니다.</p>
        </motion.div>

        {/* 멤버 추가 영역 */}
        <motion.div 
          className="bg-white rounded-xl shadow-soft p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            새 멤버 추가
          </h2>
          
          <div className="space-y-4">
            <Input
              label="이름"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="멤버 이름을 입력하세요"
              onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
            />
            
            <Button
              onClick={handleAddMember}
              loading={loading}
              className="w-full"
              variant="primary"
            >
              멤버 추가
            </Button>
          </div>
        </motion.div>

        {/* 멤버 선택 영역 */}
        <motion.div 
          className="bg-white rounded-xl shadow-soft p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 text-success-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            계정 선택 (로그인)
          </h2>
          
          <div className="space-y-4">
            <Input
              label="멤버 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름으로 검색..."
              helperText={filteredMembers.length > 0 ? `${filteredMembers.length}명의 멤버가 검색되었습니다.` : "검색 결과가 없습니다."}
            />
            
            <Select
              label="멤버 선택"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              placeholder={searchTerm ? "검색된 멤버 중 선택하세요" : "멤버를 선택하세요"}
              options={memberOptions}
              error={filteredMembers.length === 0 ? "검색 결과가 없습니다. 다른 이름으로 검색해보세요." : ""}
            />
            
            <Button
              onClick={handleMemberSelect}
              loading={loading}
              className="w-full"
              variant="success"
              disabled={!selectedMemberId}
            >
              로그인
            </Button>
          </div>
        </motion.div>
        
        {/* 푸터 */}
        <motion.div 
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          &copy; {new Date().getFullYear()} 출석체크 시스템 | 모든 권리 보유
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;
