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

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
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

export type Comment = {
  id: number;
  content: string;
  authorId: number;
  lpId: number;
  createdAt: Date;
  updatedAt: Date;
  author: Author; 
};

export type ResponseLPListDto = CursorBasedResponse<{
  data: LpItem[];
}>;

export type ResponseCommentListDto = CursorBasedResponse<{
  data: Comment[];
}>;

export type LpDetail = LpItem;

export type ResponseLPDetailDto = CommonResponse<LpDetail>;