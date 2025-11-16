// 최소 interval 간격으로만 업데이트 해서 성능을 개선한다
import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay: number = 500) {
    // 1. 상태변수 : throttledValue -> 최종적으로 쓰로틀링 적용된 값 저장하는 변수
    // 초기값 = 전달받은 value
    const [throttledValue, setThrottledValue] = useState<T>(value);

    // 2. ref las excecuted : 마지막으로 실행된 시간을 기록하는 변수
    // useRef는 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거 하지 않음
    const lastExecuted = useRef<number>(Date.now());

    // 3. useEffect : value, delay 변경될 때 아래 코드 실행
    useEffect(() => {
        // 지정된 지연 시간이 지나면 바로 값을 업데이트 해줌
        if (Date.now() >= lastExecuted.current + delay) {
            // 현재 시간이 지난경우
            // 현재 시각으로 lasExcecuted update
            lastExecuted.current = Date.now();
            // 최신 value의 값을 갱신해준다
            setThrottledValue(value);
        } else {
            // delay시간 만큼 시간이 충분히 안 지난 경우,
            // 다시 타이머 세팅해준다
            const timerID = setTimeout(() => {
                //타이머가 만료되면 마지막 업데이트 시간을 현재 시각으로 갱신한다
                lastExecuted.current = Date.now();
                // 최신 value를 throttledValue에 저장해서 컴포넌트 리렌더링
                setThrottledValue(value);
            }, delay);

            // Cleanup Function 이펙트가 재실행되기 전에 타이머가 실행되지 않았다면
            // 기본의 타임머를 clearTimeout을 통해 취소하여 중복 업데이트를 방지한다.
            return () => clearTimeout(timerID);
        }
    }, [delay, value]);

    return throttledValue;
}
export default useThrottle;
