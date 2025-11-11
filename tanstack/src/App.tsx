import { QueryClientProvider } from '@tanstack/react-query';
import { WelcomeData } from './components/WelcomeData';
import { queryClient } from './lib/queryClient';

// 앱 전체를 QueryClientProvider로 감싸 React Query 활성화
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  );
}

export default App;