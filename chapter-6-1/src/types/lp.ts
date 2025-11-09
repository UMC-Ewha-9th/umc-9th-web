import type { CursorBasedResponse, CommonResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type LpItem = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorid: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
};

export type ResponseLPListDto = CursorBasedResponse<{
  data: LpItem[];
}>;

export type LpDetail = LpItem;

export type ResponseLPDetailDto = CommonResponse<LpDetail>;