import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
    const [ScrollY, setScrollY] = useState<number>(0);

    const handleScroll = useThrottle(() => {
        setScrollY(window.scrollY);
        console.log(window.scrollY);
    }, 2000);

    // "scroll" 이라는 동작이 발생했을 때, handleScroll 함수를 실행해라.
    // 이때 handleScroll 함수는 ScrollY 값을 window.scrollY로 갱신해주는 역할을 한다.
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        // 컴포넌트 사라질때 이벤트 리스너 제거한다.
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

        console.log("리렌더링");
    }, [handleScroll]);

    return (
        <>
            <nav>
                <Link
                    to="/"
                    className="className=text-blue-500 hover:underline"
                >
                    ⬅️ Debounce 페이지로 돌아가기
                </Link>
            </nav>
            <div className="h-dvh flex flex-col items-center justify-center">
                <div>
                    <h1> What is Throttling?</h1>
                    <p>ScrollY: {ScrollY}px</p>
                    <p className="mt-4">화면을 위아래로 스크롤 해보라!</p>
                </div>
            </div>
        </>
    );
};

export default ThrottlePage;
