import { useState, useEffect, useRef, useCallback } from "react";

// 가짜 데이터 패치 함수 (네트워크 요청을 가정)
// 여기서는 딜레이를 줘서 로딩 상태를 시뮬레이션한다.
const fakeFetch = async (queryKey: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 딜레이
    if (Math.random() < 0.1 && queryKey !== "userList") {
        // 10% 확률로 에러 발생
        throw new Error("네트워크 요청 실패: 임의 에러 발생");
    }

    // queryKey에 따라 다른 데이터를 리턴한다고 가정
    if (queryKey === "userList") {
        return [
            { id: 1, name: "Gemini" },
            { id: 2, name: "User" },
        ];
    }
    return { id: 101, detail: `Detail for ${queryKey}` };
};

export const useCustomQuery = <TData = unknown,>(
    queryKey: string,
    fetchFn: (key: string) => Promise<TData>,
    options: QueryOptions = {}
) => {
    // 1. 상태 관리
    // useQuery의 핵심: 로딩/에러/데이터를 하나의 상태로 관리
    const [state, setState] = useState<QueryState<TData>>(() => {
        // 초기 상태는 캐시에서 가져온다.
        const cached = queryCache.get(queryKey);
        return cached
            ? cached
            : {
                  data: undefined,
                  status: "loading",
                  error: null,
                  lastFetched: 0,
                  staleTime: options.staleTime ?? 5 * 60 * 1000, // 기본값 5분
              };
    });

    // 2. 재시도 카운트 및 옵션 참조
    const retryCountRef = useRef(0);
    const maxRetries =
        typeof options.retry === "number"
            ? options.retry
            : options.retry === false
            ? 0
            : 3;
    const isMounted = useRef(true);

    // 3. 실제 데이터 패칭 로직 (비동기 처리, 재시도 포함)
    const executeFetch = useCallback(
        async (isInitial = false) => {
            const cached: QueryState<TData> = queryCache.get(queryKey);
            const now = Date.now();
            const isStale =
                now - cached?.lastFetched >
                (cached?.staleTime ?? options.staleTime ?? 5 * 60 * 1000);

            // ⭐️ 캐싱 로직 ⭐️
            if (cached && !isStale) {
                // 데이터가 존재하고 아직 Fresh(신선) 상태라면, 요청하지 않고 종료
                // 상태는 'success'를 유지한다.
                return;
            }

            // ⭐️ 상태: 로딩 시작 ⭐️ (백그라운드 리페치 포함)
            setState((prev) => ({
                ...prev,
                status: cached?.data ? "success" : "loading", // 데이터가 있으면 성공 상태 유지 (백그라운드 리페치)
                error: null,
            }));

            // 실제 패칭 및 리트라이 로직
            try {
                const result = await fetchFn(queryKey);

                // 컴포넌트가 언마운트되었으면 상태 업데이트하지 않음
                if (!isMounted.current) return;

                // ⭐️ 상태: 성공 ⭐️
                const newState: QueryState<TData> = {
                    data: result,
                    status: "success",
                    error: null,
                    lastFetched: now,
                    staleTime: options.staleTime ?? 5 * 60 * 1000,
                };

                // 캐시 업데이트
                queryCache.set(queryKey, newState);
                setState(newState);
            } catch (err: any) {
                // ⭐️ 재시도 로직 ⭐️
                if (retryCountRef.current < maxRetries) {
                    retryCountRef.current += 1;
                    // console.log(`[${queryKey}] 재시도: ${retryCountRef.current} / ${maxRetries}`);
                    // 재시도 딜레이를 줄 수도 있다.
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    executeFetch(false); // 재귀적으로 다시 fetch 시도
                    return;
                }

                // ⭐️ 상태: 최종 에러 ⭐️ (재시도 모두 실패)
                if (!isMounted.current) return;

                const newState: QueryState<TData> = {
                    ...state, // 기존 데이터를 유지하면서 에러 상태만 업데이트
                    status: "error",
                    error: err,
                    lastFetched: now,
                };
                queryCache.set(queryKey, newState);
                setState(newState);
            }
        },
        [queryKey, fetchFn, options.staleTime, maxRetries]
    );

    // 4. 컴포넌트 마운트 및 쿼리키 변경 시 로직 실행
    useEffect(() => {
        isMounted.current = true;
        retryCountRef.current = 0; // 새 쿼리 키 또는 마운트 시 재시도 카운트 초기화

        // 컴포넌트 마운트/쿼리 키 변경 시 데이터 가져오기 시도
        executeFetch(true);

        return () => {
            isMounted.current = false; // 언마운트 시 플래그 설정
        };
    }, [executeFetch]);

    // 5. useQuery와 동일한 반환 값 제공
    return {
        data: state.data,
        isLoading: state.status === "loading",
        isError: state.status === "error",
        error: state.error,
        // 이 예시에서는 refetch 함수는 생략했지만, executeFetch를 반환하면 된다.
    };
};

// ⭐️ 사용 예시: Tanstack Query Devtools처럼 캐시 상태를 콘솔에 출력 ⭐️
setInterval(() => {
    // console.log('--- Current Query Cache Status ---');
    // queryCache.forEach((value, key) => {
    //     console.log(`Key: ${key}, Status: ${value.status}, Data:`, value.data ? '✅' : '❌', `, LastFetched: ${Math.floor((Date.now() - value.lastFetched) / 1000)}s ago`);
    // });
}, 5000); // 5초마다 상태 출력
