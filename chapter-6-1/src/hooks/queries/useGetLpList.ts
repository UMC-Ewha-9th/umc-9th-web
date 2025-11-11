import { useQuery } from "@tanstack/react-query";
import type { ResponseLPListDto } from "../../types/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";
import { getLPList } from "../../apis/lp";


const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

type LpArray = ResponseLPListDto["data"]["data"];

function useGetLpList(paginationDto: PaginationDto) {
  const { cursor, search, order, limit } = paginationDto;

  return useQuery<ResponseLPListDto, Error, LpArray>({
    queryKey: [QUERY_KEY.lps, search, order, cursor, limit],
    queryFn: () => getLPList({ cursor, search, order, limit }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    select: (data) => data.data.data,
  });
}

export default useGetLpList;