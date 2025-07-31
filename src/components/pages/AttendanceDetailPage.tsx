import React, { useState, useEffect } from 'react';
import { 
  TestAttendanceDetail, 
  TestMember 
} from '@/types/api';
import { attendanceService, likeService, commentService } from '@/api/attendanceService';
import { memberService } from '@/api/memberService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { getErrorMessage, formatDateKorean } from '@/utils/common';

interface AttendanceDetailPageProps {
  attendanceId: string; // number 대신 string으로 변경
  currentMember: TestMember;
  onBack: () => void;
}

const AttendanceDetailPage: React.FC<AttendanceDetailPageProps> = ({
  attendanceId,
  currentMember,
  onBack,
}) => {
  const [attendance, setAttendance] = useState<TestAttendanceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  useEffect(() => {
    loadAttendanceDetail();
  }, [attendanceId]);

  const loadAttendanceDetail = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('상세 페이지에서 API 호출 전 attendanceId:', attendanceId);
      console.log('attendanceId 타입:', typeof attendanceId);
      // 캐시 방지를 위해 타임스탬프 추가
      const timestamp = new Date().getTime();
      const detail = await attendanceService.getAttendanceById(`${attendanceId}`);
      console.log('조회 API 응답 데이터:', detail);
      
      // 응답 데이터 유효성 확인
      if (!detail) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }
      
      console.log('테스트 좋아요 수:', detail.testLikes?.length);
      console.log('테스트 날짜:', detail.testAttendanceDate);
      
      setAttendance(detail);
    } catch (err) {
      console.error('데이터 로딩 오류:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!attendance) return;

    try {
      setLoading(true);
      console.log('좋아요 API 호출 시작, 매개변수:', {
        attendanceId,
        memberId: currentMember.testMemberId
      });
      const response = await attendanceService.addLike(attendanceId, { 
        testMemberId: currentMember.testMemberId 
      });
      console.log('좋아요 API 응답:', response);
      await loadAttendanceDetail(); // 데이터 다시 불러오기
      console.log('데이터 새로고침 완료');
    } catch (err) {
      console.error('좋아요 API 오류:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (likeId: number) => {
    try {
      setLoading(true);
      console.log('좋아요 취소 API 호출 시작, likeId:', likeId);
      await likeService.deleteLike(likeId);
      console.log('좋아요 취소 API 완료');
      await loadAttendanceDetail(); // 데이터 다시 불러오기
      console.log('데이터 새로고침 완료');
    } catch (err) {
      console.error('좋아요 취소 API 오류:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!attendance || !newComment.trim()) return;

    try {
      setLoading(true);
      await attendanceService.addComment(attendanceId, {
        testMemberId: currentMember.testMemberId,
        testComment: newComment.trim(),
      });
      setNewComment('');
      await loadAttendanceDetail();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const handleSaveComment = async (commentId: number) => {
    if (!editingCommentText.trim()) return;

    try {
      setLoading(true);
      await commentService.updateComment(commentId, {
        testComment: editingCommentText.trim(),
      });
      setEditingCommentId(null);
      setEditingCommentText('');
      await loadAttendanceDetail();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      await commentService.deleteComment(commentId);
      await loadAttendanceDetail();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isLikedByCurrentUser = attendance?.testLikes?.some(
    like => like.testMemberId === currentMember.testMemberId
  );

  const currentUserLike = attendance?.testLikes?.find(
    like => like.testMemberId === currentMember.testMemberId
  );

  if (loading && !attendance) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">출석 상세 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500">{error || '출석 정보를 찾을 수 없습니다.'}</p>
          <Button onClick={onBack} className="mt-4">뒤로가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <Button onClick={onBack} className="mb-4">뒤로가기</Button>

        <h1 className="text-2xl font-bold mb-2">출석 ID: {attendance?.testAttendanceId || ''}</h1>
        <p className="text-gray-600 mb-4">
          {attendance?.testAttendanceDate ? formatDateKorean(attendance.testAttendanceDate) : '날짜 정보 없음'}
        </p>

        <div className="flex items-center mb-4">
          {isLikedByCurrentUser && currentUserLike ? (
            <Button 
              onClick={() => handleUnlike(currentUserLike.testLikeId)} 
              disabled={loading}
            >
              {loading ? '처리 중...' : '좋아요 취소'}
            </Button>
          ) : (
            <Button 
              onClick={handleLike}
              disabled={loading}
            >
              {loading ? '처리 중...' : '좋아요'}
            </Button>
          )}
          <span className="ml-2 text-gray-700">
            <strong>{attendance?.testLikes?.length || 0}</strong>명이 좋아합니다
          </span>
        </div>

        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">댓글</h2>
          {attendance?.testComments?.map(comment => (
            <div key={comment.testCommentId} className="mb-2 border-b pb-2">
              {editingCommentId === comment.testCommentId ? (
                <div>
                  <Input
                    value={editingCommentText}
                    onChange={e => setEditingCommentText(e.target.value)}
                  />
                  <Button onClick={() => handleSaveComment(comment.testCommentId)}>저장</Button>
                  <Button onClick={() => setEditingCommentId(null)}>취소</Button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <p>{comment.testComment}</p>
                  {comment.testMemberId === currentMember.testMemberId && (
                    <div>
                      <Button onClick={() => handleEditComment(comment.testCommentId, comment.testComment)}>수정</Button>
                      <Button onClick={() => handleDeleteComment(comment.testCommentId)}>삭제</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="flex mt-4">
            <Input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <Button onClick={handleAddComment}>등록</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetailPage;
