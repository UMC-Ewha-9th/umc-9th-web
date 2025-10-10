import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  className?: string;
  fallbackPath?: string;
  label?: string;
};

export default function BackButton({
  className = "",
  fallbackPath = "/",
  label = "뒤로 가기",
}: BackButtonProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallbackPath);
  };
  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1
                  hover:bg-gray-100 active:scale-95 transition-transform ${className}`}
    >
      <span className="text-xl leading-none">&lt;</span>
    </button>
  );
}
