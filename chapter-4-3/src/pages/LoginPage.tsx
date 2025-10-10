import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useForm from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useState } from "react";
import AuthCard from "../components/AuthCard";
import EyeIcon from "../components/EyeIcon";

const LoginPage = () => {
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    try {
      const response = await postSignin(values);
      setItem(response.data.accessToken);
      console.log(response);
      // TODO: 로그인 성공 후 페이지 이동 로직 추가 필요
    } catch (error) {
      alert(error?.message);
    }
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <AuthCard title="로그인">
        <div className="flex flex-col gap-3">
          <input
            {...getInputProps("email")}
            name="email"
            className={`border border-[#ccc] w-full p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.email && touched?.email
                ? "border-red-500 bg-red-200"
                : "border-gray-300"
            }`}
            type={"email"}
            placeholder={"이메일"}
          />
          {errors?.email && touched?.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}

          <div className="relative">
            <input
              {...getInputProps("password")}
              className={`border border-[#ccc] w-full p-[10px] focus:border-[#807bff] rounded-sm
                          ${
                            errors?.password && touched?.password
                              ? "border-red-500 bg-red-200"
                              : "border-gray-300"
                          }`}
              type={showPassword ? "text" : "password"}
              placeholder={"비밀번호"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-0 right-0 h-full px-3 text-gray-500"
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          {errors?.password && touched?.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            로그인
          </button>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
