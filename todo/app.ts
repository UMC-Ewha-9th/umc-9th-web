function keyCodeCheck(){
  // window.event를 그대로 쓰되, TS에선 키보드 이벤트로 캐스팅
  const evt = window.event as KeyboardEvent | undefined;
  if (evt?.keyCode === 13){
    const will_todo = document.querySelector<HTMLUListElement>('#will_todo')!;
    const newLi = document.createElement('li'); // li 생성
    const newSpan = document.createElement('span');
    const newBtn = document.createElement('button');
    const todoInput = document.querySelector<HTMLInputElement>('#todoInput')!;

    newBtn.textContent = '완료';

    newLi.appendChild(newSpan);
    newLi.appendChild(newBtn); // li안에 button 담기

    newSpan.textContent = todoInput.value;

    will_todo.appendChild(newLi);
    todoInput.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const will_todo = document.querySelector<HTMLUListElement>('#will_todo')!;
  const done_todo = document.querySelector<HTMLUListElement>('#done_todo')!;

  will_todo.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null; // EventTarget -> HTMLElement
    if (target?.matches('button')) {
      const li = target.closest('li') as HTMLLIElement | null;
      if (!li) return;
      target.textContent = '삭제'; // 이동 후엔 삭제 버튼으로
      done_todo.appendChild(li);
    }
  });

  // 오른쪽 리스트에서 버튼 클릭 처리(삭제)
  done_todo.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.matches('button')) {
      target.closest('li')?.remove();
    }
  });
});