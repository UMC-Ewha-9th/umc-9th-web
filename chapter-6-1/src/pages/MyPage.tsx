import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return <div>유저 정보 로딩 중...</div>;
  }

  return (
    <div>
      <h1>{user.name}님 환영합니다.</h1>
      <img src={user.avatar as string} alt={"유저 아바타"} />
      <h1>{user.email}</h1>

      <button
        className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;