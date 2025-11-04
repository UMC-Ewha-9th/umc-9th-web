// src/api/axiosInstance.ts
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

// ✅ 환경 변수로 API 주소 관리
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// ✅ axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 쿠키 전송 허용 (서버 설정 필요)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터 (AccessToken 자동 포함)
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ 응답 인터셉터 (AccessToken 만료 시 자동 갱신)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Access Token 만료 (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        // ✅ 새 토큰 요청
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // 새 토큰 저장
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // 기존 요청 헤더 업데이트
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        // ✅ 실패했던 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        console.error('🔒 토큰 갱신 실패:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
