// 1. 메인 페이지용: LP 카드 모양
export const LpCardSkeleton = () => {
  return <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />;
};

// 2. 상세 페이지용: 댓글 모양
export const CommentSkeleton = () => {
  return (
    <div className="flex gap-4 mb-6 animate-pulse">
      {/* 프로필 이미지 스켈레톤 */}
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />

      <div className="flex-1 space-y-2">
        {/* 닉네임 스켈레톤 */}
        <div className="h-4 bg-gray-200 rounded w-24" />
        {/* 내용 스켈레톤 */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
};
