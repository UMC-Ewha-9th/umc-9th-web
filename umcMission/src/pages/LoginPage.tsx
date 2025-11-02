import { postSignin } from "../apis/auth";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
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
            const accessToken = response.data.accessToken;
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken); // 토큰 저장
                console.log("로그인 성공 및 토큰 저장 완료!!");
            } else {
                console.error("실패! 서버 응답에 토큰이 누락됨.");
            }
        } catch (error) {
            console.log("에러 발생");
        }
        // console.log(values);
        // console.log(response);
    };

    // 오류가 하나라도 있거나,입력값이 비어있으면 버튼을 비활성화
    const isDisabled =
        Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
        Object.values(values).some((value) => value === ""); // 입력값이 비어있으면 true

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    {...getInputProps("email")}
                    name="email"
                    type={"email"}
                    placeholder={"이메일"}
                    className={
                        "border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]"
                    }
                />
                {errors?.email && touched?.email && (
                    <div className="text-red 500 text-sm">{errors.email}</div>
                )}
                <input
                    {...getInputProps("password")}
                    type={"password"}
                    placeholder={"비밀번호"}
                    className={
                        "border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]"
                    }
                />
                {errors?.password && touched?.password && (
                    <div className="text-red 500 text-sm">
                        {errors.password}
                    </div>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 text-lg hover:bg-blue-700 cursor-pointer"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
