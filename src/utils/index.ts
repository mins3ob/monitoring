/**
 * Email 유효성 검사 함수
 * @param email Email
 * @returns 유효성 여부 (true: 사용 가능, false: 사용 불가능)
 */
export const validateEmail = (email: string): boolean => {
  /** Email 유효성 정규식 */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * 비밀번호 유효성 검사 함수
 * @param password 검사할 비밀번호
 * @returns 충족 여부 (true: 사용 가능, false: 사용 불가능)
 */
export const validatePassword = (password: string): boolean => {
  /** 특수 문자 포함 여부 */
  const isSpecialCharIncluded = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  /** 소문자 포함 여부 */
  const isLowercaseIncluded = /[a-z]/.test(password);
  /** 대문자 포함 여부 */
  const isUppercaseIncluded = /[A-Z]/.test(password);
  /** 최소 길이 충족 여부 */
  const isMinLengthValid = password.length >= 8;

  // 최소 8자 + (대문자, 소문자, 특수문자 중 2가지 이상 포함)
  return (
    isMinLengthValid && [isSpecialCharIncluded, isLowercaseIncluded, isUppercaseIncluded].filter(Boolean).length >= 2
  );
};
