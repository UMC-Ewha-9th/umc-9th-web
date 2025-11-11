import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
  useEffect,
} from "react";
import type { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import useLocalStorage from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: ResponseMyInfoDto["data"] | null;
  isLoading: boolean;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );

  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await getMyInfo();
          setUser(response.data);
        } catch (error) {
          console.error("유저 정보 패칭 실패, 로그아웃 처리:", error);
          handleLogoutInternal();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setUser(null);
      }
    };

    fetchUser();
  }, [accessToken]);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // [버그 수정]: JSON.stringify() 사용 안 함 (useLocalStorage가 처리)
        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        // alert("로그인 성공"); // 주석 제거 요청에 따라 제거
      }
    } catch (error) {
      // alert("로그인 실패"); // 주석 제거 요청에 따라 제거
      throw error;
    }
  };

  const handleLogoutInternal = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const logout = async () => {
    try {
      await postLogout();
      handleLogoutInternal();
      // alert("로그아웃 성공"); // 주석 제거 요청에 따라 제거
    } catch (error) {
      // alert("로그아웃 실패"); // 주석 제거 요청에 따라 제거
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};