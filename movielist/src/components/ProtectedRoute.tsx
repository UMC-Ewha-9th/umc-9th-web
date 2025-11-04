import { Navigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UserInfo {
  email: string;
  nickname: string;
  accessToken?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [userInfo] = useLocalStorage<UserInfo | null>('userInfo', null);
  const location = useLocation();

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!userInfo || !userInfo.accessToken) {
    // 현재 위치를 state로 전달하여 로그인 후 원래 페이지로 돌아갈 수 있게 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;