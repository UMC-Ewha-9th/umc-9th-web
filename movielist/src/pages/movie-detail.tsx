import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  tagline: string;
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

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId) return;

      setIsLoading(true);
      setError(null);

      try {
        // 영화 상세 정보 가져오기
        const movieResponse = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              accept: 'application/json',
            },
          }
        );

        // 출연진/제작진 정보 가져오기
        const creditsResponse = await axios.get<Credits>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              accept: 'application/json',
            },
          }
        );

        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('영화 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const directors = credits?.crew.filter((person) => person.job === 'Director') || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 배경 이미지 섹션 */}
      <div className="relative h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black"></div>
        </div>

        {/* 영화 기본 정보 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="container mx-auto">
            <div className="flex items-end gap-8">
              {/* 포스터 */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-64 rounded-xl shadow-2xl transform hover:scale-105 transition duration-300"
              />

              {/* 영화 정보 */}
              <div className="flex-1 pb-8">
                <h1 className="text-5xl font-bold mb-3">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
                )}
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-xl font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-lg">{movie.release_date?.split('-')[0]}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-lg">{movie.runtime}분</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 줄거리 섹션 */}
      <div className="container mx-auto px-10 py-12">
        <h2 className="text-2xl font-bold mb-4">줄거리</h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>
      </div>

      {/* 감독/출연 섹션 */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-10">
          {/* 감독 */}
          {directors.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">감독</h2>
              <div className="flex gap-6">
                {directors.map((director) => (
                  <div key={director.id} className="text-center">
                    {director.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
                        alt={director.name}
                        className="w-32 h-32 rounded-full object-cover mb-3 border-4 border-red-600"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mb-3 border-4 border-red-600">
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                    <p className="font-semibold">{director.name}</p>
                    <p className="text-sm text-gray-400">{director.job}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 출연진 */}
          {credits && credits.cast.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">출연진</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {credits.cast.slice(0, 16).map((actor) => (
                  <div key={actor.id} className="text-center group">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full aspect-square rounded-full object-cover mb-3 group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full aspect-square rounded-full bg-gray-800 flex items-center justify-center mb-3">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                    <p className="font-semibold text-sm">{actor.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 뒤로 가기 버튼 */}
      <div className="container mx-auto px-10 py-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          ← 돌아가기
        </button>
      </div>
    </div>
  );
};

export default MovieDetailPage;