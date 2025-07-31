import apiClient from './client';
import {
  TestAttendance,
  TestAttendanceDetail,
  CreateAttendanceRequest,
  CreateAttendanceResponse,
  CreateLikeRequest,
  CreateLikeResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '@/types/api';

export const attendanceService = {
  // 출석 체크 등록
  async createAttendance(data: CreateAttendanceRequest): Promise<CreateAttendanceResponse> {
    const response = await apiClient.post<CreateAttendanceResponse>('/test-api/test-attendances', data);
    return response.data;
  },

  // 출석 체크 전체 조회
  async getAllAttendances(): Promise<TestAttendance[]> {
    const response = await apiClient.get<TestAttendance[]>('/test-api/test-attendances');
    return response.data;
  },

  // 출석 체크 상세 조회
  async getAttendanceById(testAttendanceId: string): Promise<TestAttendanceDetail> {
    console.log('API 호출 - 출석 상세 조회 ID:', testAttendanceId); // 디버깅 로그 추가
    const response = await apiClient.get<TestAttendanceDetail[]>(`/test-api/test-attendances/${testAttendanceId}`);
    console.log('API 응답 데이터 전체:', response.data); // 응답 데이터 로깅
    
    // API가 배열을 반환하는 경우 첫 번째 항목 사용
    const detailData = Array.isArray(response.data) ? response.data[0] : response.data;
    console.log('처리된 데이터:', detailData);
    
    return detailData;
  },

  // 출석 체크 삭제
  async deleteAttendance(testAttendanceId: string): Promise<void> {
    await apiClient.delete(`/test-api/test-attendances/${testAttendanceId}`);
  },

  // 출석 체크 좋아요 추가
  async addLike(testAttendanceId: string, data: CreateLikeRequest): Promise<CreateLikeResponse> {
    const response = await apiClient.post<CreateLikeResponse>(`/test-api/test-attendances/${testAttendanceId}/test-likes`, data);
    return response.data;
  },

  // 댓글 등록
  async addComment(testAttendanceId: string, data: CreateCommentRequest): Promise<CreateCommentResponse> {
    const response = await apiClient.post<CreateCommentResponse>(`/test-api/test-attendances/${testAttendanceId}/test-comments`, data);
    return response.data;
  },
};

export const likeService = {
  // 좋아요 취소
  async deleteLike(testLikeId: number): Promise<void> {
    await apiClient.delete(`/test-likes/${testLikeId}`);
  },
};

export const commentService = {
  // 댓글 수정
  async updateComment(testCommentId: number, data: UpdateCommentRequest): Promise<UpdateCommentResponse> {
    const response = await apiClient.put<UpdateCommentResponse>(`/test-api/test-comments/${testCommentId}`, data);
    return response.data;
  },

  // 댓글 삭제
  async deleteComment(testCommentId: number): Promise<void> {
    await apiClient.delete(`/test-api/test-comments/${testCommentId}`);
  },
};
