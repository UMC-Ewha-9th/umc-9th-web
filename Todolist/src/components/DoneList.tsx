import React from "react";
import { useTodoContext } from "../context/TodoContext";

const DoneList: React.FC = () => {
  const { done, deleteDone } = useTodoContext();

  return (
    <section>
      <h2>해낸 일</h2>
      <ul className="done-list">
        {done.map((d, idx) => (
          <li key={idx}>
            <span>{d}</span>
            <button className="delete" onClick={() => deleteDone(d)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DoneList;
