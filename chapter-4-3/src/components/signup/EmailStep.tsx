import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SignupFormFields } from "../../types/form"; 

type EmailStepProps = {
  register: UseFormRegister<SignupFormFields>;
  errors: FieldErrors<SignupFormFields>; 
  onNext: () => void;
  isNextDisabled: boolean;
};

const EmailStep = ({
  register,
  errors,
  onNext,
  isNextDisabled,
}: EmailStepProps) => {
  return (
    <>
      <input
        {...register("email")}
        className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
          errors.email ? "border-red-500 bg-red-200" : "border-gray-300"
        }`}
        type="email"
        placeholder="이메일"
      />
      {errors.email && (
        <div className="text-red-500 text-sm">{errors.email.message}</div>
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

export default EmailStep;

