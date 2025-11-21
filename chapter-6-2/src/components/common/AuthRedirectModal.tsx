import { useNavigate, type Location } from "react-router-dom";

interface AuthRedirectModalProps {
  from: Location;
}

const AuthRedirectModal = ({ from }: AuthRedirectModalProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/login", { state: { from }, replace: true });
  };

  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          로그인 필요
        </h2>
        <p className="text-gray-600 mb-6">
          이 페이지에 접근하려면 로그인이 필요합니다.
          <br />
          로그인 페이지로 이동하시겠습니까?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirectModal;