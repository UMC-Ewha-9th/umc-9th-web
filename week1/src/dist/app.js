"use strict";
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
const STORAGE_KEY = "umc9th_todos";
function saveTodos() {
    const todos = {
        todo: Array.from(todoList.children).map((li) => {
            var _a;
            const span = li.querySelector("span");
            return (_a = span.textContent) !== null && _a !== void 0 ? _a : "";
        }),
        done: Array.from(doneList.children).map((li) => {
            var _a;
            const span = li.querySelector("span");
            return (_a = span.textContent) !== null && _a !== void 0 ? _a : "";
        }),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
function addTodo(text, save = true) {
    const newLi = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = text;
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
    if (save)
        saveTodos();
}
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
    if (save)
        saveTodos();
}
function loadTodos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return;
    const data = JSON.parse(raw);
    data.todo.forEach((text) => addTodo(text, false));
    data.done.forEach((text) => addDone(text, false));
}
todoInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const text = todoInput.value.trim();
        if (text === "")
            return;
        addTodo(text);
        todoInput.value = "";
    }
});
loadTodos();
