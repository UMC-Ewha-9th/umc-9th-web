import { Link } from "react-router-dom";

interface Lp {
  id: string;
  title: string;
  thumbnail: string | null;
  createdAt: string;
  likeCount?: number;
}

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      "https://placehold.co/400x400/1e293b/ffffff?text=LP";
  };

  return (
    <Link
      to={`/lps/${lp.id}`}
      className="block rounded-lg overflow-hidden shadow-lg group relative"
    >
      {/* 이미지 영역 */}
      <div className="w-full h-48 bg-gray-300">
        <img
          src={
            lp.thumbnail || "https://placehold.co/400x400/1e293b/ffffff?text=LP"
          }
          alt={lp.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          onError={handleImageError}
        />
      </div>

      {/* 오버레이 영역 */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   flex flex-col justify-end p-4"
      >
        <h3 className="text-white text-lg font-semibold truncate">
          {lp.title}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-300">
            {new Date(lp.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
              />
            </svg>
            <span className="text-sm font-medium">{lp.likeCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LpCard;
