import { useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
            accept: 'application/json',
          },
        }
      );

      setResults(data.results.slice(0, 15)); // 검색 결과 15개만
    } catch (err) {
      console.error(err);
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🔍 영화 검색</h1>

      {/* 검색 입력 */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="영화 제목을 입력하세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold ${
            loading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-pink-600 text-white hover:bg-pink-700 transition'
          }`}
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </form>

      {/* 오류 메시지 */}
      {error && <p className="text-center text-red-500 mb-6">{error}</p>}

      {/* 결과 표시 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {results.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg mb-2"
            />
            <h2 className="font-semibold text-sm">{movie.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
