import apiClient from './client';
import {
  TestMember,
  CreateMemberRequest,
  CreateMemberResponse,
  UpdateMemberRequest,
} from '@/types/api';

export const memberService = {
  // 구성원 등록
  async createMember(data: CreateMemberRequest): Promise<CreateMemberResponse> {
    const response = await apiClient.post<CreateMemberResponse>('/test-api/test-members', data);
    return response.data;
  },

  // 구성원 전체 조회
  async getAllMembers(): Promise<TestMember[]> {
    const response = await apiClient.get<TestMember[]>('/test-api/test-members');
    return response.data;
  },

  // 구성원 상세 조회
  async getMemberById(testMemberId: number): Promise<TestMember> {
    const response = await apiClient.get<TestMember>(`/test-api/test-members/${testMemberId}`);
    return response.data;
  },

  // 구성원 수정
  async updateMember(testMemberId: number, data: UpdateMemberRequest): Promise<TestMember> {
    const response = await apiClient.put<TestMember>(`/test-api/test-members/${testMemberId}`, data);
    return response.data;
  },

  // 구성원 삭제
  async deleteMember(testMemberId: number): Promise<void> {
    await apiClient.delete(`/test-api/test-members/${testMemberId}`);
  },
};
