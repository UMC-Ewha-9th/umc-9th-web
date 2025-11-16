import { useState } from "react";
import "./App.css";
import { useDebounce } from "./hooks/useDebounce";
import { Link } from "react-router-dom";

function App() {
    // input 태그에서 입력되는 값을 inputValue에 저장하는 용도
    const [inputValue, setInputValue] = useState("");
    // 0.5초가 지나야 input 태그에서 입력되는 값이 inputValue로 업데이트 된다
    const debouncedValue = useDebounce(inputValue, 500);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    return (
        <>
            <div>
                <nav>
                    <Link
                        to="/throttle"
                        className="text-red-500 hover:underline"
                    >
                        ➡️Throttle 페이지로 이동
                    </Link>
                </nav>
            </div>

            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="
    w-full p-3 border 
    border-gray-300 rounded-lg shadow-md 
    
    focus:outline-none                           // 기본 아웃라인 제거
    focus:border-purple-500                         // 포커스 시 테두리 색상
    focus:ring-4 focus:ring-purple-400              // 포커스 시 붉은색 링 강조
    focus:ring-offset-2 focus:ring-offset-white  // 링과 테두리 사이 간격 & 바탕색
    focus:shadow-purple-glow                        
    
    transition-all duration-300 ease-in-out 
    placeholder-gray-400 text-gray-800 text-lg
"
            />
            <div>
                <b> 1️⃣실시간 입력: </b>
                <span id="debounce">{inputValue}</span>
            </div>
            <div>
                <b className="text-purple-700"> 2️⃣Debounce 입력: </b>
                <span id="debounce">{debouncedValue}</span>
            </div>
        </>
    );
}

export default App;
