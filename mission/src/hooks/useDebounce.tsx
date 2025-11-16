import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebounceValue] = useState<T>(value);

    useEffect(() => {
        // delay후에 실행
        // delay 시간 후에 setDebounceValue실행하는 코드
        const handler = setTimeout(() => setDebounceValue(value), delay);

        // value가 변경되면 기존 타이머 재시작
        // 값이 계속 바뀔때마다 마지막에 멈춘값만 업데이트 한다.
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
