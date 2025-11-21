import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface Genre { id: number; name: string; }
interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: Genre[];
}
interface Cast { id: number; name: string; character: string; profile_path: string | null; }
interface Crew { id: number; name: string; job: string; profile_path: string | null; }
interface Credits { cast: Cast[]; crew: Crew[]; }

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;
    const fetchData = async () => {
      setIsPending(true);
      try {
        const [m, c] = await Promise.all([
          axios.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { language: "ko-KR" },
            headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
          }),
          axios.get<Credits>(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: { language: "ko-KR" },
            headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
          }),
        ]);
        setMovie(m.data);
        setCredits(c.data);
      } catch (e: any) {
        setIsError("데이터 불러오기 실패");
      } finally {
        setIsPending(false);
      }
    };
    fetchData();
  }, [movieId]);

  if (isPending) return <div className="flex justify-center items-center h-dvh"><LoadingSpinner /></div>;
  if (isError) return <p className="text-red-500">{isError}</p>;
  if (!movie) return null;

  const director = credits?.crew.find((c) => c.job === "Director");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* 상단: 포스터 + 상세정보 */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* 포스터 (적당한 크기) */}
        <div className="w-full md:w-64 flex-shrink-0">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl shadow-lg w-full"
            />
          ) : (
            <div className="aspect-[2/3] bg-gray-300 rounded-xl" />
          )}
        </div>

        {/* 상세정보 */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            {movie.title}
            <span className="ml-2 text-gray-500 text-xl">
              ({new Date(movie.release_date).getFullYear()})
            </span>
          </h1>
          <div className="flex flex-wrap gap-2 text-sm text-gray-700">
            {movie.runtime && <span>⏱ {movie.runtime}분</span>}
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            {movie.genres.length > 0 && (
              <span>{movie.genres.map((g) => g.name).join(", ")}</span>
            )}
            {director && <span>🎬 {director.name}</span>}
          </div>
          <p className="text-gray-800 leading-relaxed">{movie.overview}</p>
        </div>
      </div>

      {/* 하단: 출연진/제작진 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {credits?.cast.slice(0, 10).map((c) => (
            <div key={c.id} className="flex flex-col items-center text-center">
              {c.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                  alt={c.name}
                  className="w-24 h-24 rounded-full object-cover shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300" />
              )}
              <span className="mt-2 text-sm font-semibold">{c.name}</span>
              <span className="text-xs text-gray-500">{c.character}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
