import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import QueryErrorFallback from "../components/common/QueryErrorFallback";
import LpCard from "../components/LpCard";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const {
    data: lpList,
    isPending,
    isError,
    refetch,
  } = useGetLpList({
    order,
  });

  const handleSortChange = (newOrder: "asc" | "desc") => {
    setOrder(newOrder);
  };

  const LpCardSkeleton = () => (
    <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
  );

  if (isPending) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 mt-16">
        {Array.from({ length: 8 }).map((_, index) => (
          <LpCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <QueryErrorFallback refetch={refetch} />;
  }

  return (
    <div className="p-6 mt-16">
      {/* 정렬 버튼 */}
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

      {/* LP 목록 그리드 (LpCard 컴포넌트 사용) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {lpList?.map(
          (
            lp: any 
          ) => (
            <LpCard key={lp.id} lp={lp} />
          )
        )}
      </div>

      {(!lpList || lpList.length === 0) && (
        <div className="text-center p-10 text-gray-500">
          표시할 LP 목록이 없습니다.
        </div>
      )}
    </div>
  );
};

export default HomePage;
