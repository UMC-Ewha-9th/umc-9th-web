const input = document.querySelector("input");
const defaultText = document.getElementById("default");
const debounceText = document.getElementById("debounce");
const throttleText = document.getElementById("throttle");
const updateDebounceText = debounce((text) => {
    debounceText.textContent = text;
});
const updateThrottleText = throttle((text) => {
    throttleText.textContent = text;
});

input.addEventListener("input", (e) => {
    // default span태그의 textContent 부분
    defaultText.textContent = e.target.value;
    // debounce span태그의 textContent 부분 -> 지연
    updateDebounceText(e.target.value);
    updateThrottleText(e.target.value);
});

// 입력이 연속적으로 들어오면 타이머는 계속 취소되고 새로 설정된다.
// 마지막 입력이 들어오고 500ms 동안 아무 입력이 없어야 비로소 callback이 실행된다.
// 여기서 callback함수는 input에 들어온 값을 throttle span태그에 넣어주는 것.
function debounce(callback, delay = 500) {
    let timeout; // 타이머 ID저장 변수
    return (...args) => {
        // 외부에서 호출될 반환 함수
        clearTimeout(timeout); // 새로운 입력값이 들어오면 이전 타이머 무효화
        // 새로운 타이머를 설정한다.
        // delay 시간 후 콜백함수를 실행한다.
        timeout = setTimeout(() => {
            // delay 시간이 지나면 callback 함수 실행해준다.
            callback(...args);
        }, delay);
    };
}

// 여기서 callback함수는 input에 들어온 값을 throttle span태그에 넣어주는 것.
function throttle(callback, delay = 100) {
    let shouldWait = false; // 실행 기다리는 변ㅅ
    let waitingArgs; // 대기중인 마지막 인자

    // 타이머가 끝났을때 실행될 함수
    // 대기중인 인자 있으면 -> throttle span태그에 text입력 이벤트 실행
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            //기다리는 인자가 없으면
            shouldWait = false; // 대기상태 해제
        } else {
            // 기다리는 인자 있다면
            callback(...waitingArgs); // throttle span태그에 text입력 이벤트 실행
            waitingArgs = null; // 이벤트 처리 했으니까 다시 대기중인 것 null로 만듦
            setTimeout(timeoutFunc, delay); // 타이머 다시 실행
        }
    };
    // ...args는 throttle 함수가 반환하는 "내부 함수"가 나중에 호출될 때 받는 인자들을 말한다.
    return (...args) => {
        if (shouldWait) {
            // shouldWait 상태가 true이면 기다리기
            waitingArgs = args; // 대기중인 인자들 저장해두기(아직 timeOut시간이 안 끝난 경우이다.)
            return;
        }
        // shouldWait상태가 false라서 기다리지 않고 이벤트 발생시키는 상황
        callback(...args); // 1. 이벤트 발생시키고
        shouldWait = true; // 2. 다시 대기 상태로 바꾸기

        // delay 시간동안 false상태로 바꾸고 기다리기
        setTimeout(timeoutFunc, delay);
    };
}
