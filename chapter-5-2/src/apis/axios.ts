import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// InternalAxiosRequestConfig 타입을 확장하여 _retry 플래그 추가
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지
let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    // AuthContext에서 JSON.stringify를 사용했으므로, "null" 문자열도 체크
    if (storedToken && storedToken !== "null") {
      // JSON 문자열을 파싱하여 실제 토큰 값 추출
      const accessToken = JSON.parse(storedToken);

      // accessToken이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // 수정된 요청 설정을 반환
    return config;
  },
  // 요청 인터셉터가 실패하면, 에러를 반환
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 발생 -> refresh 토큰을 통한 토큰 갱신을 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답 그대로 반환
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 401 에러면서, 아직 재시도 하지 않은 요청 경우 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // refresh 엔드포인트 401 에러가 발생한 경우 (Unauthorized), 중복 재시도 방지를 위해 로그아웃 처리
      if (originalRequest.url === "/v1/auth/refresh") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // 이미 refresh 요청이 진행 중인 경우, 기존의 Promise를 사용
      if (!refreshPromise) {
        // refresh 요청 실행 후, 프라미스를 전역 변수에 할당
        refreshPromise = (async () => {
          const storedRefreshToken = localStorage.getItem(
            LOCAL_STORAGE_KEY.refreshToken
          );
          const refreshToken = storedRefreshToken
            ? JSON.parse(storedRefreshToken)
            : null;

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          // 새 토큰이 반환
          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          localStorage.setItem(
            LOCAL_STORAGE_KEY.accessToken,
            JSON.stringify(newAccessToken)
          );
          localStorage.setItem(
            LOCAL_STORAGE_KEY.refreshToken,
            JSON.stringify(newRefreshToken)
          );
          // 새 accessToken을 반환하여 다른 요청들이 이것을 사용할 수 있게 함
          return newAccessToken;
        })()
          .catch((error) => {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            window.location.href = "/login"; // refresh 실패 시 로그인 페이지로 이동
            return Promise.reject(error); // 에러를 전파하여 원래 요청도 실패 처리
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      // 진행중인 refreshPromise가 해결될 때까지 대기
      return refreshPromise.then((newAccessToken) => {
        // 원본 요청의 Authorization 헤더를 갱신된 토큰으로 업데이트
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        // 업데이트 된 원본 요청 재시도
        return axiosInstance.request(originalRequest);
      });
    }
    // 401 에러가 아닌 경우에 그대로 오류 반환
    return Promise.reject(error);
  }
);

