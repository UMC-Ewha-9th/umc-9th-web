import type { ReactNode } from "react";
import BackButton from "./BackButton";

type AuthCardProps = {
  title: string;
  children: ReactNode;
};

const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <div className="w-[340px] max-w-full rounded-xl p-6 shadow-xl">
      {/* 카드 상단 제목 영역 */}
      <div className="relative mb-6 flex items-center justify-center">
        <BackButton className="absolute left-0" />
        <h1 className="text-lg font-semibold text-grey">{title}</h1>
      </div>

      {/* 카드 내부 콘텐츠 */}
      {children}
    </div>
  );
};

export default AuthCard;
