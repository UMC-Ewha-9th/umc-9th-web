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

    const handleSubmit = () => {};
    console.log(values);

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
                    disabled={false}
                    className="w-full bg-blue-600 text-white py-3 text-lg hover:bg-blue-700 cursor-pointer"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
