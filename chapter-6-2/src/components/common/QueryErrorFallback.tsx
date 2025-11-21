import type { UseQueryResult } from "@tanstack/react-query";

interface QueryErrorFallbackProps {
  refetch: () => Promise<UseQueryResult>;
  message?: string;
}

const QueryErrorFallback = ({
  refetch,
  message = "데이터를 불러오는 데 실패했습니다.",
}: QueryErrorFallbackProps) => {
  return (
    <div className="text-center p-10 mt-16">
      <p className="text-red-500 mb-4 font-semibold">{message}</p>
      <button
        onClick={() => refetch()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        재시도
      </button>
    </div>
  );
};

export default QueryErrorFallback;