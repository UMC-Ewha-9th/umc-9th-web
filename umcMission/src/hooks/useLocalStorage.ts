export const userLocalStorage = (key: string) => {
    // item을 서버에 저장하는 함수. value를 전달해준다
    const setItem = (value: unknown) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value)); // JSON형식으로 바꿔서 넣어준다.
        } catch (error) {
            console.log(error);
        }
    };

    const getItem = () => {
        try {
            // 서버에서 가져온 데이터를 item에 담기
            const item = window.localStorage.getItem(key); // 키값으로 서치
            return item ? JSON.parse(item) : null; // item이 있다면 파싱해서(객체형태로) 데이터 가져오기
        } catch (e) {
            console.log(e);
        }
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            console.log(e);
        }
    };

    return { setItem, getItem, removeItem };
};
