// 공정 처리 결과 차트 색상
export const PROCESS_RESULT_COLORS = {
  SUCCESS: '#66BB6A', // 성공 - 부드러운 녹색
  FAIL: '#EF5350', // 실패 - 부드러운 빨간색
  IN_PROGRESS: '#FFA726', // 진행중 - 따뜻한 주황색
  WAITING: '#78909C', // 대기 - 차분한 회색
} as const;

// 품질검사 결과 차트 색상
export const QUALITY_RESULT_COLORS = {
  PASS: '#42A5F5', // 합격 - 밝은 파란색
  FAIL: '#EC407A', // 불합격 - 선명한 분홍색
  WAITING: '#78909C', // 대기 - 차분한 청회색
} as const;
