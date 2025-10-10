import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

interface Genre {
  id: number;
  name: string;
}
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
interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}
interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}
interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isPending: isMoviePending,
    error: movieError,
  } = useCustomFetch<MovieDetails>(`/movie/${movieId}`);

  const {
    data: credits,
    isPending: isCreditsPending,
    error: creditsError,
  } = useCustomFetch<Credits>(`/movie/${movieId}/credits`);

  // 2. 두 요청 중 하나라도 로딩 중이면 로딩 상태로 처리합니다.
  const isPending = isMoviePending || isCreditsPending;
  // 3. 두 요청 중 하나라도 에러가 발생하면 에러 상태로 처리합니다.
  const error = movieError || creditsError;

  if (isPending)
    return (
      <div className="flex justify-center items-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!movie) return null;

  const director = credits?.crew.find((c) => c.job === "Director");

  // UI/디자인 개선: Tailwind CSS를 활용하여 전체적인 레이아웃과 디테일을 다듬었습니다.
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex-shrink-0">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
          ) : (
            <div className="aspect-[2/3] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full md:w-2/3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {movie.title}
            <span className="ml-3 text-gray-400 text-2xl font-normal">
              ({new Date(movie.release_date).getFullYear()})
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            {movie.runtime && (
              <span className="flex items-center gap-1">
                ⏱ {movie.runtime}분
              </span>
            )}
            <span className="flex items-center gap-1">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            {director && (
              <span className="flex items-center gap-1">
                🎬 {director.name}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
              >
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            {movie.overview}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
          주요 출연진
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
          {credits?.cast.slice(0, 10).map((c) => (
            <div key={c.id} className="text-center">
              {c.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                  alt={c.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg mb-2"
                />
              ) : (
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-white" />
              )}
              <span className="mt-2 text-md font-bold block">{c.name}</span>
              <span className="text-sm text-gray-500">{c.character}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
