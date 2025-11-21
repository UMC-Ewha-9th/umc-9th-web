import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetLpDetailQuery from "../hooks/queries/useGetLpDetailQuery";
import useGetCommentsInfinite from "../hooks/queries/useGetCommentsInfinite";
import { useCreateComment } from "../hooks/mutations/useCreateComment";
import QueryErrorFallback from "../components/common/QueryErrorFallback";
import PencilIcon from "../components/icons/PencilIcon";
import TrashIcon from "../components/icons/TrashIcon";
import HeartIcon from "../components/icons/HeartIcon";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { CommentSkeleton } from "../components/common/Skeleton";
import type { Comment } from "../types/lp";

const LpDetailPage = () => {
  const { id } = useParams();
  const lpId = Number(id);
  
  const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
  const [content, setContent] = useState("");

  // LP 상세 정보 쿼리
  const {
    data: lp,
    isPending: isLpLoading,
    isError: isLpError,
    refetch: refetchLp,
  } = useGetLpDetailQuery(lpId);

  // 댓글 무한 스크롤 쿼리
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments
  } = useGetCommentsInfinite({
    lpId,
    order: commentOrder,
    limit: 10
  });

  // 댓글 작성 훅
  const { mutate: createComment, isPending: isCreating } = useCreateComment(lpId);

  const handleSubmitComment = () => {
    if (!content.trim()) return; // 빈 내용 방지
    
    createComment(content, {
      onSuccess: () => {
        setContent(""); // 입력창 초기화
      }
    });
  };

  // 무한 스크롤 트리거
  const observerRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleSortChange = (order: "asc" | "desc") => {
    setCommentOrder(order);
  };

  // 에러 처리
  if (isLpError || isCommentsError) {
    return (
      <QueryErrorFallback 
        refetch={async () => { 
          refetchComments(); 
          return await refetchLp(); 
        }} 
      />
    );
  }

  // 로딩 처리
  if (isLpLoading) {
    return (
      <article className="max-w-4xl mx-auto p-6 mt-16">
         <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
      </article>
    );
  }

  if (!lp) return <div className="text-center p-10 mt-16">LP 정보를 찾을 수 없습니다.</div>;

  return (
    <article className="max-w-4xl mx-auto p-6 mt-16 bg-white shadow-lg rounded-lg">
      {/* 상단 LP 상세 정보 */}
      <header className="flex justify-between items-start mb-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <img
            src={"https://placehold.co/100x100/1e293b/ffffff?text=User"}
            alt="Author"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lp.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(lp.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-blue-600"><PencilIcon className="w-5 h-5" /></button>
          <button className="text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
        </div>
      </header>

      <section className="mt-8">
        <img
          src={lp.thumbnail || "https://placehold.co/800x600/1e293b/ffffff?text=LP"}
          alt={lp.title}
          className="w-full h-auto max-h-[600px] object-contain rounded-lg mb-8 shadow-md"
        />
        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{lp.content}</div>
      </section>

      <footer className="mt-10 pt-6 border-t">
        <div className="flex flex-wrap gap-2">
          {lp.tags?.map((tag) => (
            <span key={tag.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              #{tag.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center mt-8">
          <button className="text-red-500 hover:text-red-600 transition-colors">
            <HeartIcon className="w-10 h-10" />
          </button>
          <span className="text-lg font-semibold text-gray-800 mt-2">{lp.likes?.length || 0}</span>
        </div>
      </footer>

      {/* 하단 댓글 섹션 */}
      <section className="mt-16 border-t pt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">댓글</h2>
          <div className="flex gap-2">
            <button onClick={() => handleSortChange("asc")} className={`px-3 py-1 text-sm rounded-full border ${commentOrder === "asc" ? "bg-black text-white" : "bg-white text-gray-600"}`}>오래된순</button>
            <button onClick={() => handleSortChange("desc")} className={`px-3 py-1 text-sm rounded-full border ${commentOrder === "desc" ? "bg-black text-white" : "bg-white text-gray-600"}`}>최신순</button>
          </div>
        </div>

        {/* 댓글 입력창 */}
        <div className="mb-10 bg-gray-50 p-4 rounded-lg">
          <textarea 
            placeholder="댓글을 입력해주세요" 
            className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 h-24"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">타인을 비방하는 내용은 제재될 수 있습니다.</span>
            <button 
              onClick={handleSubmitComment}
              disabled={isCreating || !content.trim()}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                isCreating || !content.trim() 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isCreating ? "등록 중..." : "작성"}
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-6">
          {isCommentsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
          ) : (
            <>
              {commentsData?.pages.map((page) =>
                Array.isArray(page.data?.data) && page.data.data.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <img
                      src={comment.author?.avatar || "https://placehold.co/40x40/1e293b/ffffff?text=U"}
                      alt={comment.author?.name || "Unknown"}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                            {comment.author?.name || "알 수 없음"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {isFetchingNextPage && (
                <div className="mt-4"><CommentSkeleton /><CommentSkeleton /></div>
              )}
            </>
          )}
          
          {!isCommentsLoading && (!commentsData || commentsData.pages[0]?.data?.data?.length === 0) && (
            <p className="text-center text-gray-500 py-10">아직 작성된 댓글이 없습니다.</p>
          )}
          
          <div ref={observerRef} className="h-4" />
        </div>
      </section>
    </article>
  );
};

export default LpDetailPage;