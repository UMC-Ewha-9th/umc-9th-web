import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/home';
import NotFound from './pages/not-found';
import Movies from './pages/movies';
import RootLayout from './layout/root-layout';
import MovieDetailPage from './pages/movie-detail';
import SignupPage from './pages/signup';
import LoginPage from './pages/login';
import SearchPage from './pages/search';

/* ✅ 추가: 보호 라우트와 페이지 임포트 */
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'movies',
        element: <Movies />,
      },
      {
        path: 'movies/popular',
        element: <Movies />, // 나중에 Popular 컴포넌트로 교체 가능
      },
      {
        path: 'movies/now-playing',
        element: <Movies />,
      },
      {
        path: 'movies/top-rated',
        element: <Movies />,
      },
      {
        path: 'movies/upcoming',
        element: <Movies />,
      },
      {
        path: 'movies/:movieId', // 가장 마지막에 배치
        element: <MovieDetailPage />,
      },

      /* ✅ 추가: 인증 필요한 보호 라우트 */
      {
        path: 'search',
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
