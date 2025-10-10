import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import BackButton from "../components/BackButton";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "닉네임을 입력해 주세요." }), // 에러 메시지 수정
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

// 비밀번호 가시성 토글 아이콘 컴포넌트
const EyeIcon = ({ closed }: { closed: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    {closed ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
    )}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const SignupPage = () => {
  const navigate = useNavigate(); // navigate 함수 초기화
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck, ...rest } = data;
      await postSignup(rest);
      alert("회원가입이 완료되었습니다.");
      navigate("/"); // 회원가입 성공 시 홈으로 이동
    } catch (error) {
      console.error(error);
      // 실제 서비스에서는 사용자에게 더 친절한 에러 메시지를 보여주는 것이 좋습니다.
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleNextToPasswordStep = async () => {
    const isEmailValid = await trigger("email");
    if (isEmailValid) setStep(2);
  };

  const handleNextToNameStep = async () => {
    const isPasswordValid = await trigger(["password", "passwordCheck"]);
    if (isPasswordValid) setStep(3);
  };

  const emailValue = getValues("email");
  const passwordValue = getValues("password");
  const passwordCheckValue = getValues("passwordCheck");

  const isNextToPasswordDisabled = !emailValue || !!errors.email;
  const isNextToNameDisabled =
    !passwordValue ||
    !passwordCheckValue ||
    !!errors.password ||
    !!errors.passwordCheck;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-[340px] max-w-full rounded-xl p-6 shadow-xl">
        <div className="relative mb-6 flex items-center justify-center">
          <BackButton className="absolute left-0" />
          <h1 className="text-lg font-semibold text-grey">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <input
                {...register("email")}
                className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
                  errors.email
                    ? "border-red-500 bg-red-200"
                    : "border-gray-300"
                }`}
                type="email"
                placeholder="이메일"
              />
              {errors.email && (
                <div className="text-red-500 text-sm">
                  {errors.email.message}
                </div>
              )}
              <button
                type="button"
                onClick={handleNextToPasswordStep}
                disabled={isNextToPasswordDisabled}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
              >
                다음
              </button>
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <div className="p-2 bg-gray-100 rounded-md text-gray-700">
                {emailValue}
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
                    errors.password
                      ? "border-red-500 bg-red-200"
                      : "border-gray-300"
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-0 right-0 h-full px-3 text-gray-500"
                >
                  <EyeIcon closed={!showPassword} />
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm">
                  {errors.password.message}
                </div>
              )}
              <div className="relative">
                <input
                  {...register("passwordCheck")}
                  className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
                    errors.passwordCheck
                      ? "border-red-500 bg-red-200"
                      : "border-gray-300"
                  }`}
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호 확인"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                  className="absolute top-0 right-0 h-full px-3 text-gray-500"
                >
                  <EyeIcon closed={!showPasswordCheck} />
                </button>
              </div>
              {errors.passwordCheck && (
                <div className="text-red-500 text-sm">
                  {errors.passwordCheck.message}
                </div>
              )}
              <button
                type="button"
                onClick={handleNextToNameStep}
                disabled={isNextToNameDisabled}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
              >
                다음
              </button>
            </>
          )}

          {/* Step 3: Name (Nickname) */}
          {step === 3 && (
            <>
              <div className="p-2 bg-gray-100 rounded-md text-gray-700">
                {emailValue}
              </div>
              <input
                {...register("name")}
                className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
                  errors.name
                    ? "border-red-500 bg-red-200"
                    : "border-gray-300"
                }`}
                type="text"
                placeholder="닉네임"
              />
              {errors.name && (
                <div className="text-red-500 text-sm">
                  {errors.name.message}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
              >
                회원가입 완료
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

