import type { PaginationDto } from "../types/common";
import type { ResponseLPListDto, ResponseLPDetailDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLPList = async (
  paginationDto: PaginationDto
): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpById = async (id: number): Promise<ResponseLPDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};