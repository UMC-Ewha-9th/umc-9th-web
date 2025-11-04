import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/home';
import NotFound from './pages/not-found';
import Movies from './pages/movies';
import RootLayout from './layout/root-layout';
import MovieDetailPage from './pages/movie-detail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;