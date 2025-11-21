export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type CursorBasedResponse<T> = {
  data: T;
  status: boolean;
  statusCode: number;
  message: string;
  nextCursor: number | null;
  hasNext: boolean;
};

export type PaginationDto = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
};
