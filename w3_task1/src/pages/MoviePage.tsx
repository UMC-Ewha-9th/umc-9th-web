import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movies";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
    // key 불러올 수 있다.
    // console.log(import.meta.env.VITE_TMDB_KEY);

    const [movies, setMovies] = useState<Movie[]>([]);
    //1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    // 2. 에러 상태
    const [isError, setIsError] = useState(false);
    // 3. 페이지 처리
    const [page, setPage] = useState(1);

    const params = useParams<{
        category: string;
    }>();
    console.log(params);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);
            try {
                const { data } = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${params.category}?language=en-US&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${
                                import.meta.env.VITE_TMDB_KEY
                            }`,
                        },
                    }
                );
                setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
    }, [page, params.category]);

    if (isError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">
                    에러가 발생했습니다
                </span>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-center gap-6 mt-5 ">
                <button
                    className="bg-[#dda5e3] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                >{`<`}</button>
                <span>{page} 페이지</span>

                <button
                    className="bg-[#dda5e3] "
                    onClick={() => setPage((prev) => prev + 1)}
                >{`>`}</button>
            </div>
            {isPending && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}
            {!isPending && (
                <div
                    className="p-10 gird gap-4 grid-cols-2 
        sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>
    );
}
