import { useState } from 'react';
import { UserDataDisplay } from './UserDataDisplay';

export const WelcomeData = () => {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  // 존재하지 않는 ID로 404 에러를 발생 -> 재시도 테스트
  const handleTestRetry = () => {
    setUserId(999999);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
        <button onClick={() => setIsVisible(!isVisible)}>
          컴포넌트 토글 (언마운트 테스트)
        </button>
        <button
          onClick={handleTestRetry}
          style={{ background: '#ff9800', color: 'white' }}
        >
          재시도 테스트 (404 에러)
        </button>
      </div>

      {/* isVisible 상태에 따라 UserDataDisplay 컴포넌트 렌더링/언마운트 */}
      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
};