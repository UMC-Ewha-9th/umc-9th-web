import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLpComment } from "../../apis/lp";

export const useCreateComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createLpComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
    onError: (error) => {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  });
};