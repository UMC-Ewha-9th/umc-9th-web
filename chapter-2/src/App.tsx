import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const handleIncrease = () => {
    setCount((prev: number) => prev + 1);
  };

  const handleDecrease = () => {
    setCount((prev: number) => prev - 1);
  };

  return (
    <>
      <h1>{count}</h1>
      <div>
        <button onClick={handleIncrease}>+1 증가</button>
        <button onClick={handleDecrease}>-1 감소</button>
      </div>
    </>
  );
}

export default App;