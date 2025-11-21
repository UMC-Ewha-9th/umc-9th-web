import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SignupFormFields } from "../../types/form";

type NameStepProps = {
  register: UseFormRegister<SignupFormFields>;
  errors: FieldErrors<SignupFormFields>;
  isSubmitting: boolean;
  emailValue: string;
};

const NameStep = ({
  register,
  errors,
  isSubmitting,
  emailValue,
}: NameStepProps) => {
  return (
    <>
      <div className="p-2 bg-gray-100 rounded-md text-gray-700">
        {emailValue}
      </div>
      <input
        {...register("name")}
        className={`border w-full p-[10px] focus:border-[#807bff] rounded-sm ${
          errors.name ? "border-red-500 bg-red-200" : "border-gray-300"
        }`}
        type="text"
        placeholder="닉네임"
      />
      {errors.name && (
        <div className="text-red-500 text-sm">{errors.name.message}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
      >
        회원가입 완료
      </button>
    </>
  );
};

export default NameStep;

