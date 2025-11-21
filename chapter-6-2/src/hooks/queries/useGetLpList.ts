import { useInfiniteQuery } from "@tanstack/react-query";
import type { ResponseLPListDto } from "../../types/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";
import { getLPList } from "../../apis/lp";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

function useGetLpList(paginationDto: PaginationDto) {
  const { search, order, limit } = paginationDto;

  return useInfiniteQuery<ResponseLPListDto, Error>({
    queryKey: [QUERY_KEY.lps, search, order],
    
    queryFn: ({ pageParam }) => 
      getLPList({ 
        cursor: pageParam as number | undefined, 
        search, 
        order, 
        limit 
      }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      // 1. ResponseLPListDto의 최상위에 nextCursor가 있는 경우
      // @ts-ignore
      if (lastPage.nextCursor) return lastPage.nextCursor;
      
      // 2. data 객체 안에 nextCursor가 있는 경우 (안전장치)
      // @ts-ignore
      if (lastPage.data?.nextCursor) return lastPage.data.nextCursor;

      // 3. 다음 페이지가 없는 경우
      return undefined;
    },

    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export default useGetLpList;