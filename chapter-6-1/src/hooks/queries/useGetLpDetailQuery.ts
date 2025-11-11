import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getLpById } from "../../apis/lp";
import type { LpDetail, ResponseLPDetailDto } from "../../types/lp";

type UseGetLpDetailQueryOptions = Omit<
  UseQueryOptions<ResponseLPDetailDto, Error, LpDetail>,
  "queryKey" | "queryFn"
>;

const useGetLpDetailQuery = (
  id: number,
  options?: UseGetLpDetailQueryOptions
) => {
  return useQuery<ResponseLPDetailDto, Error, LpDetail>({
    queryKey: ["lp", id],
    queryFn: () => getLpById(id),
    select: (data) => data.data,
    ...options,
  });
};

export default useGetLpDetailQuery;