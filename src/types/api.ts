// 멤버 타입
export interface TestMember {
  testMemberId: number;
  testMemberName: string;
}

// 출석 체크 타입 (목록용)
export interface TestAttendance {
  testAttendanceId: string; // number에서 string으로 변경
  testMemberId: number;
  testAttendanceDate: string;
  testLikesCount: number;
  testCommentsCount: number;
}

// 좋아요 타입
export interface TestLike {
  testLikeId: number;
  testMemberId: number;
  testMemberName: string;
}

// 댓글 타입
export interface TestComment {
  testCommentId: number;
  testMemberId: number;
  testMemberName: string;
  testComment: string;
}

// 출석 체크 상세 타입
export interface TestAttendanceDetail {
  testAttendanceId: string; // number에서 string으로 변경
  testMemberId: number;
  testAttendanceDate: string;
  testLikes: TestLike[];
  testComments: TestComment[];
}

// API 요청 타입들
export interface CreateMemberRequest {
  testMemberName: string;
}

export interface UpdateMemberRequest {
  testMemberName: string;
}

export interface CreateAttendanceRequest {
  testMemberId: number;
}

export interface CreateLikeRequest {
  testMemberId: number;
}

export interface CreateCommentRequest {
  testMemberId: number;
  testComment: string;
}

export interface UpdateCommentRequest {
  testComment: string;
}

// API 응답 타입들
export interface CreateMemberResponse {
  testMemberId: number;
}

export interface CreateAttendanceResponse {
  testAttendanceId: number; // 올바른 필드명으로 수정
}

export interface CreateLikeResponse {
  testLikeId: number;
}

export interface CreateCommentResponse {
  testCommentId: number;
}

export interface UpdateCommentResponse {
  testCommentId: number;
}

export interface ApiError {
  error: string;
}
