import React, { useState } from "react";
import { useTodoContext } from "../context/TodoContext";

const TodoInput: React.FC = () => {
  const { addTodo } = useTodoContext();
  const [todoInput, setTodoInput] = useState("");

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo(todoInput);
      setTodoInput("");
    }
  };

  return (
    <input
      className="todo-input"
      type="text"
      placeholder="할 일을 입력하세요"
      value={todoInput}
      onChange={(e) => setTodoInput(e.target.value)}
      onKeyUp={handleKeyUp}
    />
  );
};

export default TodoInput;
