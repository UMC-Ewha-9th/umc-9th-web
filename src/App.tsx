import "./App.css";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import DoneList from "./components/DoneList";
import { TodoProvider } from "./context/TodoContext";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";

// ✅ 다크모드 토글 버튼
function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useThemeContext();
  return (
    <button onClick={toggleDarkMode} className="dark-toggle">
      {darkMode ? "라이트 모드" : "다크 모드"}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <div className="app">
          <h1>투두리스트</h1>
          <DarkModeToggle /> {/* ✅ 버튼 추가 */}
          <TodoInput />
          <div className="sections">
            <TodoList />
            <DoneList />
          </div>
        </div>
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
