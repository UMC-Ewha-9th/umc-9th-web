import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HamburgerIcon, SearchIcon } from "./icons";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { accessToken, user, isLoading, logout } = useAuth();

  return (
    <nav
      className="bg-white shadow-md fixed w-full h-16 z-30"
    >
      <div className="flex items-center justify-between p-4 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="text-gray-600 p-1 rounded-md hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <HamburgerIcon className="w-6 h-6" />
          </button>
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-500"
          >
            SpinningDolimpan
          </Link>
        </div>

        <div className="space-x-6 flex items-center">
          {isLoading ? (
            <span className="text-gray-500">로딩 중...</span>
          ) : !accessToken ? (
            // 비로그인 상태
            <>
              <Link
                to={"/search"}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Search"
              >
                <SearchIcon className="w-6 h-6" />
              </Link>
              <Link
                to={"/login"}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                로그인
              </Link>
              <Link
                to={"/signup"}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold
                                  hover:bg-blue-700 transition-colors"
              >
                회원가입
              </Link>
            </>
          ) : (
            // 로그인 상태
            <>
              <Link
                to={"/search"}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Search"
              >
                <SearchIcon className="w-6 h-6" />
              </Link>
              {user && (
                <span className="text-gray-700 font-medium">
                  {user.name}님 반갑습니다.
                </span>
              )}
              <button
                onClick={logout}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;