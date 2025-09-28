import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "umc9th_todos";

interface Todos {
  todo: string[];
  done: string[];
}

interface TodoContextType {
  todos: string[];
  done: string[];
  addTodo: (text: string) => void;
  addDone: (text: string) => void;
  deleteDone: (text: string) => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<string[]>([]);
  const [done, setDone] = useState<string[]>([]);

  // localStorage 저장
  const saveTodos = (nextTodos: string[], nextDone: string[]) => {
    const data: Todos = { todo: nextTodos, done: nextDone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // 기존 데이터 불러오기
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data: Todos = JSON.parse(raw);
    setTodos(data.todo);
    setDone(data.done);
  }, []);

  // 해야 할 일 추가
  const addTodo = (text: string) => {
    const value = text.trim();
    if (value === "" || todos.includes(value)) return;
    const nextTodos = [...todos, value];
    setTodos(nextTodos);
    saveTodos(nextTodos, done);
  };

  // 해야 할 일 -> 해낸 일 이동
  const addDone = (text: string) => {
    const nextTodos = todos.filter((t) => t !== text);
    const nextDone = [...done, text];
    setTodos(nextTodos);
    setDone(nextDone);
    saveTodos(nextTodos, nextDone);
  };

  // 해낸 일 삭제
  const deleteDone = (text: string) => {
    const nextDone = done.filter((d) => d !== text);
    setDone(nextDone);
    saveTodos(todos, nextDone);
  };

  return (
    <TodoContext.Provider value={{ todos, done, addTodo, addDone, deleteDone }}>
      {children}
    </TodoContext.Provider>
  );
};

// ✅ 커스텀 훅
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodoContext must be used within a TodoProvider");
  return context;
};
