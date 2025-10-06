import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie } from "../types/movies";
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
    // key 불러올 수 있다.
    // console.log(import.meta.env.VITE_TMDB_KEY);

    const [movies, setMovies] = useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovies = async () => {
            const { data } = await axios(
                "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
                {
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_TMDB_KEY
                        }`,
                    },
                }
            );
            setMovies(data.results);
        };
        fetchMovies();
    }, []);

    // console.log(movies[0]?.adult);
    return (
        <div className="gird grid-cols2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}
