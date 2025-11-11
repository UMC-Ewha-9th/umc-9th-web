import React from "react";
import { useCustomQuery, fakeFetch } from "./useCustomQuery"; // 위에 작성한 파일이라고 가정

const UserList = () => {
    // useQuery와 유사한 사용법
    const { data, isLoading, isError, error } = useCustomQuery(
        "userList",
        fakeFetch,
        {
            staleTime: 5000,
            retry: 2,
        }
    );

    if (isLoading) return <div>로딩 중...</div>; // ⭐️ 로딩 상태 처리 ⭐️
    if (isError) return <div>에러 발생: {error?.message}</div>; // ⭐️ 에러 상태 처리 ⭐️

    return (
        <div>
            <h3>사용자 목록 (캐시 테스트)</h3>
            {data.map((user) => (
                <div key={user.id}>{user.name}</div>
            ))}
            <p>
                데이터는 5초 동안 신선합니다. 5초 안에 페이지를 떠났다가
                돌아오면 로딩 없이 캐시된 데이터를 즉시 보게 될 거예요.
            </p>
        </div>
    );
};

// 다른 컴포넌트에서 같은 쿼리 키를 사용해도 캐시 데이터를 공유한다.
const SomeOtherComponent = () => {
    const { data, isLoading } = useCustomQuery(
        "userList", // ⭐️ 같은 queryKey 사용 ⭐️
        fakeFetch,
        { staleTime: 5000 }
    );

    // 첫 컴포넌트가 로딩을 끝냈다면, 이 컴포넌트는 로딩 없이 즉시 데이터를 보여준다.
    if (isLoading) return <p>다른 컴포넌트 로딩...</p>;
    return <p>다른 컴포넌트도 데이터 공유 성공! 사용자 수: {data.length}</p>;
};

const App = () => {
    const [showList, setShowList] = React.useState(true);

    return (
        <div>
            <button onClick={() => setShowList((prev) => !prev)}>
                {showList
                    ? "리스트 숨기기 (Inactive 상태로 만들기)"
                    : "리스트 다시 보기 (캐시/리페치 테스트)"}
            </button>
            <hr />
            {showList && <UserList />}
            {showList && <SomeOtherComponent />}
        </div>
    );
};

// <App />을 렌더링해서 실습하면 된다.
