import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useEffect, useState } from "react";
import AuthCard from "../components/AuthCard";
import EyeIcon from "../components/EyeIcon";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [navigate, accessToken, from]);

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
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <AuthCard title="로그인">
        <div className="flex flex-col gap-3">
          {/* ... (이메일, 비밀번호 input) ... */}
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
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            <div className="flex items-center justify-center gap-4">
              <img
                src={"/public/images/GoogleLogo.svg"}
                alt="Google Logo image"
                className="w-6 h-6"
              />
              <span>구글 로그인</span>
            </div>
          </button>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
