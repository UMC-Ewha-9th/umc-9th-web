import { useCustomFetch } from "../hooks/useCustomFetch";
import type { WelcomeData } from "../types/user";

interface UserDataDisplayProps {
  userId: number;
}

// 데이터를 받아 실제 UI를 렌더링하는 컴포넌트
export const UserDataDisplay = ({ userId }: UserDataDisplayProps) => {
  const { data, isPending, isError } = useCustomFetch<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  // isPending : React Query의 로딩 상태
  if (isPending) {
    return <div>Loading... (User ID: {userId})</div>;
  }

  // isError : React Query의 에러 상태
  if (isError) {
    return <div>Error Occurred</div>;
  }

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
      <p style={{ fontSize: "12px", color: "#666" }}>User ID: {data?.id}</p>
    </div>
  );
};
