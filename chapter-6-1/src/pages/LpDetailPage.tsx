import { useParams } from "react-router-dom";
import useGetLpDetailQuery from "../hooks/queries/useGetLpDetailQuery";
import QueryErrorFallback from "../components/common/QueryErrorFallback";
import PencilIcon from "../components/icons/PencilIcon";
import TrashIcon from "../components/icons/TrashIcon";
import HeartIcon from "../components/icons/HeartIcon";

const LpDetailPage = () => {
  const { id } = useParams();
  const {
    data: lp,
    isPending,
    isError,
    refetch,
  } = useGetLpDetailQuery(Number(id));

  if (isPending) {
    return (
      <article className="max-w-4xl mx-auto p-6 mt-16">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </header>
        <section className="mt-8">
          <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse mb-8" />
          <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
        </section>
        <footer className="mt-10 pt-6 border-t">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mt-6 mx-auto" />
        </footer>
      </article>
    );
  }

  if (isError) {
    return <QueryErrorFallback refetch={refetch} />;
  }

  if (!lp) {
    return (
      <div className="text-center p-10 mt-16">LP 정보를 찾을 수 없습니다.</div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-6 mt-16 bg-white shadow-lg rounded-lg">
      <header className="flex justify-between items-start mb-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <img
            src={"https://placehold.co/100x100/1e293b/ffffff?text=User"}
            alt="Author"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lp.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(lp.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-blue-600" title="수정">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-red-600" title="삭제">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <section className="mt-8">
        <img
          src={
            lp.thumbnail || "https://placehold.co/800x600/1e293b/ffffff?text=LP"
          }
          alt={lp.title}
          className="w-full h-auto max-h-[600px] object-contain rounded-lg mb-8 shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/800x600/1e293b/ffffff?text=LP";
          }}
        />
        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
          {lp.content}
        </div>
      </section>

      <footer className="mt-10 pt-6 border-t">
        <div className="flex flex-wrap gap-2">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center mt-8">
          <button
            className="text-red-500 hover:text-red-600 transition-colors"
            title="좋아요"
          >
            <HeartIcon className="w-10 h-10" />
          </button>
          <span className="text-lg font-semibold text-gray-800 mt-2">
            {lp.likes.length}
          </span>
        </div>
      </footer>
    </article>
  );
};

export default LpDetailPage;
