import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Step = 'email' | 'password' | 'nickname';

// Zod 스키마 정의
const emailSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요!')
    .email('올바른 이메일 형식을 입력해주세요.'),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),
  passwordConfirm: z
    .string()
    .min(1, '비밀번호를 다시 입력해주세요!'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.'),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type NicknameForm = z.infer<typeof nicknameSchema>;

// 사용자 정보 타입 정의
interface UserInfo {
  email: string;
  nickname: string;
  accessToken?: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    nickname: '',
  });

  // 로컬 스토리지에 사용자 정보 저장
  const [, setUserInfo] = useLocalStorage<UserInfo | null>('userInfo', null);

  // 이메일 폼
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  // 비밀번호 폼
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  // 닉네임 폼
  const {
    register: registerNickname,
    handleSubmit: handleSubmitNickname,
    formState: { errors: nicknameErrors, isValid: isNicknameValid },
  } = useForm<NicknameForm>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const onEmailSubmit = (data: EmailForm) => {
    setSignupData((prev) => ({ ...prev, email: data.email }));
    setStep('password');
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    setSignupData((prev) => ({ ...prev, password: data.password }));
    setStep('nickname');
  };

  const onNicknameSubmit = (data: NicknameForm) => {
    const finalData = {
      ...signupData,
      nickname: data.nickname,
    };
    
    // TODO: 실제 회원가입 API 호출
    console.log('회원가입 데이터:', finalData);
    
    // 회원가입 성공 후 사용자 정보 저장
    const newUserInfo: UserInfo = {
      email: finalData.email,
      nickname: finalData.nickname,
      accessToken: 'dummy-token-123', // 실제로는 API 응답에서 받아옴
    };
    
    setUserInfo(newUserInfo);
    
    alert('회원가입이 완료되었습니다!');
    navigate('/');
  };

  const handleBack = () => {
    if (step === 'password') {
      setStep('email');
    } else if (step === 'nickname') {
      setStep('password');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBack}
          className="text-white text-2xl mb-8"
        >
          ←
        </button>

        <h1 className="text-3xl font-bold text-white text-center mb-8">회원가입</h1>
        
        {step === 'email' ? (
          // 이메일 단계
          <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-6">
            <button type="button" className="w-full px-4 py-3 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              구글 로그인
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            <div>
              <input
                type="email"
                placeholder="이메일을 입력해주세요!"
                {...registerEmail('email')}
                className={`w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none ${
                  emailErrors.email
                    ? 'border-2 border-red-500'
                    : 'focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {emailErrors.email && (
                <p className="text-red-500 text-sm mt-2">{emailErrors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isEmailValid}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isEmailValid
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </form>
        ) : step === 'password' ? (
          // 비밀번호 단계
          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-white mb-6">
              <span>✉️</span>
              <span>{signupData.email}</span>
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요!"
                  {...registerPassword('password')}
                  className={`w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none ${
                    passwordErrors.password
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
              {passwordErrors.password && (
                <p className="text-red-500 text-sm mt-2">{passwordErrors.password.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  {...registerPassword('passwordConfirm')}
                  className={`w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none ${
                    passwordErrors.passwordConfirm
                      ? 'border-2 border-red-500'
                      : 'focus:ring-2 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswordConfirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordErrors.passwordConfirm && (
                <p className="text-red-500 text-sm mt-2">{passwordErrors.passwordConfirm.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isPasswordValid}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isPasswordValid
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </form>
        ) : (
          // 닉네임 단계
          <form onSubmit={handleSubmitNickname(onNicknameSubmit)} className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-6xl text-gray-500">👤</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="매튜오디나인"
                {...registerNickname('nickname')}
                className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none ${
                  nicknameErrors.nickname
                    ? 'border-2 border-red-500'
                    : 'focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {nicknameErrors.nickname && (
                <p className="text-red-500 text-sm mt-2">{nicknameErrors.nickname.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isNicknameValid}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isNicknameValid
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              회원가입 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;