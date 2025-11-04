import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // 1. 로컬 스토리지에서 토큰 가져오기
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    // 2. 토큰이 존재하는지 확인하기 (null이거나 "null" 문자열이 아닌지)
    if (storedToken && storedToken !== "null") {
      // 3. JSON 문자열을 파싱하여 실제 토큰 값("token_string") 추출하기
      const accessToken = JSON.parse(storedToken);
      // 4. 요청 헤더에 최신 토큰을 설정하기
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // 5. 수정된 설정(config)으로 요청 보내기
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
