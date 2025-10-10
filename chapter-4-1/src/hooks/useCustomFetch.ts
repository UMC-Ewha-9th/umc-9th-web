import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import type { AxiosRequestConfig } from "axios";

export default function useCustomFetch<T>(
  url: string,
  options?: AxiosRequestConfig
) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsPending(true);
      setError(null);
      try {
        const response = await axiosInstance.get(url, {
          ...options,
          signal: controller.signal,
        });
        setData(response.data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError("데이터를 불러오는 중 에러가 발생했습니다.");
        }
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, isPending, error };
}
