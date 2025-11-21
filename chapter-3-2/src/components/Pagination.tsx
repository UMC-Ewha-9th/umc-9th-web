import React from "react";

interface PaginationProps {
  /** 현재 페이지(1부터 시작) */
  page: number;
  /** 페이지 변경 콜백: 다음 페이지 번호를 넘겨줌 */
  onChange: (nextPage: number) => void;
  /** 전체 페이지 수 (선택). 주면 '다음' 비활성화 처리 */
  totalPages?: number;
  /** 바깥에서 간격/여백 커스터마이즈용 */
  className?: string;
  /** 버튼 라벨 커스터마이즈 (선택) */
  prevLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}

export default function Pagination({
  page,
  onChange,
  totalPages,
  className = "",
  prevLabel = "<",
  nextLabel = ">",
}: PaginationProps) {
  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : true;

  const baseBtn =
    "bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200";
  const disabledCls = "disabled:bg-gray-300 disabled:cursor-not-allowed";
  const hoverCls = "hover:bg-[#b2dab1]";

  return (
    <div className={`flex items-center justify-center gap-6 mt-5 ${className}`}>
      <button
        type="button"
        aria-label="이전 페이지"
        className={`${baseBtn} ${hoverCls} ${disabledCls} cursor-pointer`}
        disabled={!canPrev}
        onClick={() => canPrev && onChange(page - 1)}
      >
        {prevLabel}
      </button>

      <span aria-live="polite">{page} 페이지</span>

      <button
        type="button"
        aria-label="다음 페이지"
        className={`${baseBtn} ${hoverCls} ${disabledCls} cursor-pointer`}
        disabled={!canNext}
        onClick={() => canNext && onChange(page + 1)}
      >
        {nextLabel}
      </button>
    </div>
  );
}
