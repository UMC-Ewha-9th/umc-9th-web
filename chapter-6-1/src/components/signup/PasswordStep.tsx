import type { FieldErrors, UseFormRegister } from "react-hook-form";
import EyeIcon from "../EyeIcon";
import type { SignupFormFields } from "../../types/form"; 

type PasswordStepProps = {
  register: UseFormRegister<SignupFormFields>;
  errors: FieldErrors<SignupFormFields>;
  onNext: () => void;
  isNextDisabled: boolean;
  emailValue: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showPasswordCheck: boolean;
  setShowPasswordCheck: (show: boolean) => void;
};

const PasswordStep = ({
  register,
  errors,
  onNext,
  isNextDisabled,
  emailValue,
  showPassword,
  setShowPassword,
  showPasswordCheck,
  setShowPasswordCheck,
}: PasswordStepProps) => {
  return (
    <>
      <div className="p-2 bg-gray-100 rounded-md text-gray-700">
        {emailValue}
      </div>
      <div className="relative">
        <input
          {...register("password")}
          className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
            errors.password ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-0 right-0 h-full px-3 text-gray-500"
        >
          <EyeIcon visible={showPassword} />
        </button>
      </div>
      {errors.password && (
        <div className="text-red-500 text-sm">{errors.password.message}</div>
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
          <EyeIcon visible={showPasswordCheck} />
        </button>
      </div>
      {errors.passwordCheck && (
        <div className="text-red-500 text-sm">
          {errors.passwordCheck.message}
        </div>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
      >
        다음
      </button>
    </>
  );
};

export default PasswordStep;

