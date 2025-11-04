import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인/회원가입 페이지인지 확인
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <NavLink to="/" className="text-2xl font-bold text-red-600">
            ALLIE
          </NavLink>

          {/* 로그인/회원가입 페이지가 아닐 때: 영화 메뉴 */}
          {!isAuthPage && (
            <div className="flex gap-6">
              <NavLink
                to="/movies/popular"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                인기
              </NavLink>
              
              <NavLink
                to="/movies/now-playing"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                상영 중
              </NavLink>
              
              <NavLink
                to="/movies/top-rated"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                평점 높은
              </NavLink>
              
              <NavLink
                to="/movies/upcoming"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                개봉 예정
              </NavLink>
            </div>
          )}

          {/* 로그인/회원가입 페이지일 때: 로그인/회원가입 버튼 */}
          {isAuthPage && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/login'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/signup'
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;