import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`, // 환경변수로 교체 추천
              accept: 'application/json',
            },
          }
        );
        setMovies(data.results);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-8 p-10">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
          onMouseEnter={() => setIsHovered(movie.id)}
          onMouseLeave={() => setIsHovered(null)}
        >
          {/* 포스터: 확대 제거, blur만 적용 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={`w-full aspect-[2/3] object-cover rounded-xl transition duration-200 ${
              isHovered === movie.id ? 'blur' : ''
            }`}
          />
  
          {/* 오버레이: 항상 DOM에 두고 투명도만 토글 + z-10로 위에 표시 */}
          <div
            className={`absolute inset-0 z-10 flex flex-col justify-end p-4 text-white 
                        bg-gradient-to-t from-black/70 via-black/20 to-transparent
                        rounded-xl transition-opacity duration-200
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
  );
  
};

export default MoviesPage;
