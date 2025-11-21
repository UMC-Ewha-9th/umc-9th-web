import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import QueryErrorFallback from "../components/common/QueryErrorFallback";
import LpCard from "../components/LpCard";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { LpCardSkeleton } from "../components/common/Skeleton";
import type { LpItem } from "../types/lp";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const {
    data,
    isPending,          // 초기 로딩 상태
    isError,
    refetch,
    fetchNextPage,      // 다음 페이지 데이터 요청 함수
    hasNextPage,        // 다음 페이지 존재 여부
    isFetchingNextPage, // 추가 데이터 로딩 상태
  } = useGetLpList({ 
    order,
    limit: 10,
  });

  // 무한 스크롤 트리거
  const observerRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleSortChange = (newOrder: "asc" | "desc") => {
    setOrder(newOrder);
  };

  if (isError) {
    return <QueryErrorFallback refetch={refetch} />;
  }

  return (
    <div className="p-6 mt-16">
      {/* 정렬 버튼 영역 */}
      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={() => handleSortChange("asc")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            order === "asc"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => handleSortChange("desc")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            order === "desc"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          최신순
        </button>
      </div>

      {/* 1. 초기 로딩 시 상단 스켈레톤 */}
      {isPending ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LpCardSkeleton key={`init-skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <>
          {/* 2. 데이터 렌더링 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data?.pages.map((page) => (
              page.data.data.map((lp: LpItem) => (
                <LpCard key={lp.id} lp={lp} />
              ))
            ))}
            
            {/* 3. 추가 로딩 시 하단 스켈레톤 */}
            {isFetchingNextPage && (
               Array.from({ length: 4 }).map((_, index) => (
                 <LpCardSkeleton key={`next-skeleton-${index}`} />
               ))
            )}
          </div>

          {/* 데이터가 없을 경우 안내 메시지 */}
          {(!data || data.pages[0]?.data.data.length === 0) && !isFetchingNextPage && (
            <div className="text-center p-10 text-gray-500">
              표시할 LP 목록이 없습니다.
            </div>
          )}

          {/* 무한 스크롤 트리거 (Sentinel) */}
          <div ref={observerRef} className="h-4 w-full" />
        </>
      )}
    </div>
  );
};

export default HomePage;