// 공정 처리 결과 차트 색상
export const PROCESS_RESULT_COLORS = {
  SUCCESS: '#4CAF50', // 성공 - 밝은 녹색
  FAIL: '#F44336', // 실패 - 밝은 빨간색
  IN_PROGRESS: '#FF9800', // 진행중 - 주황색
  WAITING: '#9E9E9E', // 대기 - 회색
} as const;

// 품질검사 결과 차트 색상
export const QUALITY_RESULT_COLORS = {
  PASS: '#2196F3', // 합격 - 파란색
  FAIL: '#E91E63', // 불합격 - 분홍색
  WAITING: '#607D8B', // 대기 - 청회색
} as const;
