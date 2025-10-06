import { useEffect, useState } from "react";
import "./App.css";
import MoviePage from "./pages/MoviePage";
import axios from "axios";

const App = () => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const fetchMovies = async () => {
            const response = await axios(
                "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
                {
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_TMDB_KEY
                        }`,
                    },
                }
            );
            console.log(response);
        };
        fetchMovies();
    }, []);
    return (
        <>
            <MoviePage />
        </>
    );
};

export default App;
