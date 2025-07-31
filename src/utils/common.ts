/**
 * 클래스명들을 조건부로 결합
 */
export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 입력값이 비어있는지 확인
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * 에러 메시지 추출
 */
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * 날짜를 한국어 형식으로 포맷팅 (YYYY년 MM월 DD일)
 */
export const formatDateKorean = (date: Date | string): string => {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    
    // 유효한 날짜인지 확인
    if (isNaN(d.getTime())) {
      console.error('유효하지 않은 날짜:', date);
      return '';
    }
    
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}년 ${month}월 ${day}일`;
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '';
  }
};

/**
 * 디바운스 함수
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
