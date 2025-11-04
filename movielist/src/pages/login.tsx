import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Zod 스키마 정의
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요!')
    .email('올바른 이메일 형식을 입력해주세요.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

type LoginForm = z.infer<typeof loginSchema>;

// 사용자 정보 타입 정의
interface UserInfo {
  email: string;
  nickname: string;
  accessToken?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 추가: 이전 페이지 정보 활용
  const [showPassword, setShowPassword] = useState(false);

  // 로컬 스토리지에 사용자 정보 저장
  const [, setUserInfo] = useLocalStorage<UserInfo | null>('userInfo', null);

  // ✅ 추가: 로그인 전에 접근하려던 페이지 (ProtectedRoute에서 넘긴 state.from)
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginForm) => {
    // TODO: 실제 로그인 API 호출
    console.log('로그인 데이터:', data);

    // 로그인 성공 후 사용자 정보 저장
    const newUserInfo: UserInfo = {
      email: data.email,
      nickname: 'User', // 실제로는 API 응답에서 받아옴
      accessToken: 'dummy-token-456', // 실제로는 API 응답에서 받아옴
    };

    setUserInfo(newUserInfo);

    alert('로그인 성공!');
    // ✅ 수정: 원래 가려던 페이지로 리다이렉트
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="text-white text-2xl mb-8"
        >
          ←
        </button>

        <h1 className="text-3xl font-bold text-white text-center mb-8">로그인</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            className="w-full px-4 py-3 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66	l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            구글 로그인
          </button>

          {/* OR 구분선 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* 이메일 입력 */}
          <div>
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              {...register('email')}
              className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none ${
                errors.email
                  ? 'border-2 border-red-500'
                  : 'focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요!"
                {...register('password')}
                className={`w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none ${
                  errors.password
                    ? 'border-2 border-red-500'
                    : 'focus:ring-2 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isValid
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
