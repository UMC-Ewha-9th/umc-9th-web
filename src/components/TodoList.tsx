import React from "react";
import { useTodoContext } from "../context/TodoContext";

const TodoList: React.FC = () => {
  const { todos, addDone } = useTodoContext();

  return (
    <section>
      <h2>해야 할 일</h2>
      <ul className="todo-list">
        {todos.map((t, idx) => (
          <li key={idx}>
            <span>{t}</span>
            <button className="complete" onClick={() => addDone(t)}>
              완료
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
