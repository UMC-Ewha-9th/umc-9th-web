import clsx from "clsx";
import { useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
  const { theme } = useTheme();
  const isLightMode = theme === "LIGHT";

  return (
    <div
      className={clsx(
        "p-4 h-dvh w-full",
        isLightMode ? "bg-gray-800" : "bg-white"
      )}
    >
      <h1
        className={clsx(
          "text-wxl font-bold",
          isLightMode ? "text-white" : "text-black"
        )}
      >
        Theme Content
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-white" : "text-black")}>
        파이팅 파이팅 파이팅 우리 모두 파이팅
      </p>
    </div>
  );
}
