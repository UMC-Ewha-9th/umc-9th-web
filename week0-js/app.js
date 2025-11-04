const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

// === localStorage key 이름 ===
const STORAGE_KEY = "umc9th_todos";

/* -------------------------
   (공통) 현재 리스트 저장
------------------------- */
function saveTodos() {
  const todos = {
    todo: Array.from(todoList.children).map((li) =>
      li.querySelector("span").textContent
    ),
    done: Array.from(doneList.children).map((li) =>
      li.querySelector("span").textContent
    ),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/* -------------------------
   해야 할 일 추가
------------------------- */

function addTodo(text, save = true) {
  const newLi = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  // 완료 버튼
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "완료";
  completeBtn.classList.add("complete");
  completeBtn.addEventListener("click", function () {
    addDone(text);
    newLi.remove();
    saveTodos();
  });

  newLi.appendChild(span);
  newLi.appendChild(completeBtn);

  todoList.appendChild(newLi);

  if (save) saveTodos();
}


/* -------------------------
   해낸 일 추가 (삭제 버튼만)
------------------------- */
function addDone(text, save = true) {
  const newLi = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;
  span.style.textDecoration = "line-through";
  span.style.color = "#999";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.classList.add("delete");
  deleteBtn.addEventListener("click", function () {
    newLi.remove();
    saveTodos();
  });

  newLi.appendChild(span);
  newLi.appendChild(deleteBtn);

  doneList.appendChild(newLi);

  if (save) saveTodos();
}

/* -------------------------
   (페이지 로드 시) 기존 데이터 불러오기
------------------------- */
function loadTodos() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!data) return;

  data.todo.forEach((text) => addTodo(text, false));
  data.done.forEach((text) => addDone(text, false));
}

/* -------------------------
   입력창 이벤트 처리
------------------------- */
todoInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const text = todoInput.value.trim();
    if (text === "") return;
    addTodo(text);
    todoInput.value = "";
  }
});

/* -------------------------
   초기 실행
------------------------- */
loadTodos();
