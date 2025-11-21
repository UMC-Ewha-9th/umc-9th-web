import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import EmailStep from "../components/signup/EmailStep";
import PasswordStep from "../components/signup/PasswordStep";
import NameStep from "../components/signup/NameStep";
import type { SignupFormFields } from "../types/form"; 

export const signupSchema = z
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
    name: z.string().min(1, { message: "닉네임을 입력해 주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
  } = useForm<SignupFormFields>({ 
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignupFormFields> = async (data) => { 
    try {
      const { passwordCheck, ...rest } = data;
      await postSignup(rest);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error(error);
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
      <AuthCard title="회원가입">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {step === 1 && (
            <EmailStep
              register={register}
              errors={errors}
              onNext={handleNextToPasswordStep}
              isNextDisabled={isNextToPasswordDisabled}
            />
          )}
          {step === 2 && (
            <PasswordStep
              register={register}
              errors={errors}
              onNext={handleNextToNameStep}
              isNextDisabled={isNextToNameDisabled}
              emailValue={emailValue}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showPasswordCheck={showPasswordCheck}
              setShowPasswordCheck={setShowPasswordCheck}
            />
          )}
          {step === 3 && (
            <NameStep
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              emailValue={emailValue}
            />
          )}
        </form>
      </AuthCard>
    </div>
  );
};

export default SignupPage;