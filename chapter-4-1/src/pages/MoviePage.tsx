import { useState, useMemo } from "react";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category = "popular" } = useParams<{ category: string }>();

  const options = useMemo(
    () => ({
      params: { page },
    }),
    [page]
  );

  const {
    data: movieResponse,
    isPending,
    error,
  } = useCustomFetch<MovieResponse>(`/movie/${category}`, options);

  if (error) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <span className="text-red-500 text-2xl">{error}</span>
      </div>
    );
  }

  const movies = movieResponse?.results ?? [];
  const totalPages = movieResponse?.total_pages ?? 500;

  return (
    <div className="p-4">
      {isPending ? (
        <div className="flex items-center justify-center h-[calc(100dvh-150px)]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Pagination page={page} onChange={setPage} totalPages={totalPages} />
          <div
            className="p-10 grid gap-8 grid-cols-2 sm:grid-cols-3
        md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {movies.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
