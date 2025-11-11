import { useQuery } from '@tanstack/react-query';

export const useCustomFetch = <T>(url: string) => {
  return useQuery({
    // 쿼리 키: 데이터를 식별하고 캐싱하는 고유 키
    queryKey: [url],

    // 쿼리 함수: 실제로 데이터를 가져오는 비동기 함수
    queryFn: async ({ signal }) : Promise<T> => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
      }

      return response.json();
    },

    // 재시도 설정: 실패 시 최대 3회 자동 재시도
    retry: 3,

    // 재시도 지연 시간: 지수 백오프 전략
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 30000),

    // 데이터 신선도 관리: 5분
    staleTime: 5 * 60 * 1000,
  });
};