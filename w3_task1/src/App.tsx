import "./App.css";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import MovieDetailPage from "./pages/MovieDetailPage";

// BrowserRouter v5
// createBrowserRouter v6 --> 이거 기준으로 코딩할 것.
// react-router-dom v7(next.js, remix)

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "movies/:category",
                element: <MoviePage />,
            },
            {
                path: "movies/:category/:movieId",
                element: <MovieDetailPage />,
            },
        ],
    },
]);

// movie/upcoming
// movie/popular
// movie/now_playing
// movie/top_rated
// movie?category=upcoming
// movie/123
// movie/category/{movie_id}

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
