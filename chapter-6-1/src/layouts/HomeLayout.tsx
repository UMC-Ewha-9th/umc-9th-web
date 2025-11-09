// [수정] tsconfig.json의 baseUrl 설정을 고려하여 절대 경로로 수정
import MainLayout from "./MainLayout";
/**
 * 공개 레이아웃
 * 별도 로직 없이 공통 MainLayout을 반환합니다.
 */
const HomeLayout = () => {
  return <MainLayout />;
};

export default HomeLayout;