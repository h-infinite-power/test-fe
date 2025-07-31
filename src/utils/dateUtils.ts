/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * 날짜를 한국어 형식으로 포맷팅 (YYYY년 MM월 DD일)
 */
export const formatDateKorean = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

/**
 * 두 날짜가 같은 날인지 확인
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  return formatDate(date1) === formatDate(date2);
};
