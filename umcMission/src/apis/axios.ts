import axios from "axios";

export const axiosInstance = axios.create({
    // http://localhost8000 을 생략할 수 있음.
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    // 쿠기 설정
    // withCredentials: true,
});
