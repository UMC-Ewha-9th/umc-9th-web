// queryCache: 모든 쿼리 데이터를 저장할 전역 저장소
// Map<queryKey 문자열, { data, status, lastFetched, retryCount, staleTime }>
const queryCache = new Map();

// 쿼리 상태 타입 정의
type QueryStatus = "loading" | "success" | "error";

interface QueryState<TData> {
    data: TData | undefined;
    status: QueryStatus;
    error: Error | null;
    lastFetched: number; // 데이터가 마지막으로 fetch된 시간 (staleTime 비교 기준)
    staleTime: number;
}

// useCustomQuery 훅의 옵션 타입
interface QueryOptions {
    staleTime?: number; // 밀리초 (기본값: 5분)
    retry?: number | boolean; // 재시도 횟수 (기본값: 3)
}
