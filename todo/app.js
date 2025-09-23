function keyCodeCheck(){
    if(window.event.keyCode === 13){
        const will_todo = document.querySelector('#will_todo');
        const newLi = document.createElement('li'); // li 생성
        const newSpan = document.createElement('span');
        const newBtn = document.createElement('button');
        const todoInput = document.querySelector('#todoInput');

        newBtn.textContent = '완료';

        newLi.appendChild(newSpan);
        newLi.appendChild(newBtn); // li안에 button 담기
		

        newSpan.textContent = todoInput.value;

        will_todo.appendChild(newLi);
        todoInput.value = '';
      }
}

document.addEventListener('DOMContentLoaded', () => {
    const will_todo = document.querySelector('#will_todo');
    const done_todo = document.querySelector('#done_todo');
  
    // 왼쪽 리스트에서 버튼 클릭 처리
    will_todo.addEventListener('click', (e) => {
      if (e.target.matches('button')) {
        const li = e.target.closest('li');
        e.target.textContent = '삭제'; // 이동 후엔 삭제 버튼으로
        done_todo.appendChild(li);
      }
    });
  
    // 오른쪽 리스트에서 버튼 클릭 처리(삭제)
    done_todo.addEventListener('click', (e) => {
      if (e.target.matches('button')) {
        e.target.closest('li').remove();
      }
    });
  });