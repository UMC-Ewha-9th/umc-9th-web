import { useState } from "react";
import type { Movie } from "../types/movies";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [ishovered, setISHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movies/now_playing/${movie.id}`)}
            className="relative rounded-xl shadow-lg 
            overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-105"
            onMouseEnter={() => setISHovered(true)}
            onMouseLeave={() => setISHovered(false)}
        >
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={`${movie.title}의 이미지`}
                className=""
            />
            {ishovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50to-transparent backdrop-blured-md flex flex-col jsutify-center items-center text-white p-4">
                    <h2 className="text-lg font-bold text-center leading-snug">
                        {movie.title}
                    </h2>
                    <p className="text-sm">{movie.overview}</p>
                </div>
            )}
        </div>
    );
}
