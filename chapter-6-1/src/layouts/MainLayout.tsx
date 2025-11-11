import { useState, useEffect } from "react"; // [수정] useEffect 추가
import { Outlet } from "react-router-dom";
// [임포트 경로 수정] 'src/layouts' 기준 상대 경로로 변경
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FloatingButton from "../components/FloatingButton";

const MainLayout = () => {
  // [수정] 화면 너비에 따라 초기 상태 설정
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // [신규] 화면 크기 변경 감지 useEffect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 화면이 모바일 크기(768px 미만)가 되면
        // 사이드바를 자동으로 닫습니다.
        setIsSidebarOpen(false);
      } else {
        // 데스크탑 크기로 돌아오면
        // 사이드바를 다시 엽니다 (기본 상태)
        setIsSidebarOpen(true);
      }
    };

    // resize 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // [] 빈 배열: 컴포넌트 마운트 시 1회만 실행

  // 햄버거 버튼 클릭 시 실행될 토글 함수
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // 사이드바 외부 클릭 시 실행될 닫기 함수
  const handleCloseSidebar = () => {
    // 모바일일 때만 닫히도록 조건 추가
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    // (참고) 데스크탑에서는 main 영역을 클릭해도 닫히지 않습니다.
    // (영상에서 본 동작과 일치)
  };

  return (
    <div className="h-dvh flex flex-col">
      <Navbar onToggleSidebar={handleToggleSidebar} />

      <div className="flex flex-1 mt-16 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        <main
          className="flex-1 p-6 overflow-y-auto"
          onClick={handleCloseSidebar} // 모바일에서만 동작
        >
          <Outlet />
        </main>
      </div>

      <Footer />
      <FloatingButton />
    </div>
  );
};

export default MainLayout;