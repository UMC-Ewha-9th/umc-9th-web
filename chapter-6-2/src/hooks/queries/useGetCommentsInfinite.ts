import { useInfiniteQuery } from "@tanstack/react-query";
import type { ResponseCommentListDto } from "../../types/lp";
import { getLpComments } from "../../apis/lp";

const QUERY_KEY = {
  lpComments: "lpComments",
};

interface UseGetCommentsInfiniteProps {
  lpId: number;
  order: "asc" | "desc";
  limit?: number;
}

function useGetCommentsInfinite({ lpId, order, limit = 10 }: UseGetCommentsInfiniteProps) {
  return useInfiniteQuery<ResponseCommentListDto, Error>({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam }) => 
      getLpComments(lpId, { 
        cursor: pageParam as number | undefined,
        order,
        limit 
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // @ts-ignore
      if (lastPage.nextCursor) return lastPage.nextCursor;
      // @ts-ignore
      if (lastPage.data?.nextCursor) return lastPage.data.nextCursor;
      return undefined;
    },
    enabled: !isNaN(lpId) && lpId > 0,
    staleTime: 1000 * 60, 
  });
}

export default useGetCommentsInfinite;