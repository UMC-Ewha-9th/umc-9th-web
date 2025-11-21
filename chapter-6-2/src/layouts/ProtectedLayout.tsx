import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "./MainLayout";
import AuthRedirectModal from "../components/common/AuthRedirectModal";

const ProtectedLayout = () => {
  const { accessToken, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-dvh text-lg font-semibold">
        인증 정보를 확인 중입니다...
      </div>
    );
  }

  if (!accessToken) {
    return <AuthRedirectModal from={location} />;
  }

  return <MainLayout />;
};

export default ProtectedLayout;