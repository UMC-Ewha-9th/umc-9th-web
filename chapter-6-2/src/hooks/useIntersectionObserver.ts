// 무한 스크롤 트리거용 훅
import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [callback, options]);

  return observerRef;
};
