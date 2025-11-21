import { Link } from "react-router-dom";

const FloatingButton = () => {
  const targetPath = "/";

  return (
    <Link
      to={targetPath}
      className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-20"
      aria-label="새 항목 추가"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </Link>
  );
};

export default FloatingButton;
