import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';

const MoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null); // 데이터 fetch 시작 시 에러 상태 초기화
      
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              accept: 'application/json',
            },
          }
        );
        // 15개만 보여주기 (5열 3행)
        setMovies(data.results.slice(0, 15));
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('영화 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]); // currentPage가 변경될 때마다 다시 fetch

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen p-10">

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-6 py-2 rounded-lg transition ${
            currentPage === 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          이전
        </button>

        <span className="text-white text-lg">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-6 py-2 rounded-lg transition ${
            currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          다음
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 로딩 스피너 */}
      {isLoading && !error && (
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 영화 그리드 */}
      {!isLoading && !error && (
        <div className="grid grid-cols-5 gap-10 p-10 mb-10">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              onMouseEnter={() => setIsHovered(movie.id)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              {/* 포스터 */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className={`w-full aspect-[2/3] object-cover rounded-2xl transition duration-200 ${
                  isHovered === movie.id ? 'blur-sm' : ''
                }`}
              />
      
              {/* 오버레이 */}
              <div
                className={`absolute inset-0 z-10 flex flex-col justify-end p-4 text-white 
                            bg-gradient-to-t from-black/70 via-black/20 to-transparent
                            rounded-2xl transition-opacity duration-200
                            ${isHovered === movie.id ? 'opacity-100' : 'opacity-0'}`}
              >
                <h2 className="text-base font-bold mb-1">{movie.title}</h2>
                <p className="text-sm overflow-hidden text-ellipsis line-clamp-3">
                  {movie.overview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
};

export default MoviesPage;