import type { PaginationDto } from "../types/common";
import type { ResponseLPListDto, ResponseLPDetailDto, ResponseCommentListDto } from "../types/lp";
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

export const getLpComments = async (
  lpId: number,
  paginationDto: PaginationDto
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });
  return data;
};

export const createLpComment = async (
  lpId: number,
  content: string
): Promise<void> => {
  await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
};