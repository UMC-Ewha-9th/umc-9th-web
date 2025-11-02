import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import axios from "axios";
const schema = z
    .object({
        // email 유효성 검사(email()과 에러 메시지 체이닝)
        email: z
            .string()
            .email({ message: "error! 올바른 이메일 형식이 아님" }),
        // password 유효성 검사
        password: z
            .string()
            .min(8, { message: "error! 비밀번호는 8자 이상이어야 합니다" })
            .max(20, { message: "error! 비밀번호는 20자 이상이어야 합니다." }),
        passwordCheck: z
            .string()
            .min(8, { message: "error! 비밀번호는 8자 이상이어야 합니다" })
            .max(20, { message: "error! 비밀번호는 20자 이상이어야 합니다." }),

        name: z.string().min(1, { message: "error! 이름을 입력해 주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

// 타입을 추론해주는 부분 정의 email, password, name
type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
    });
    // 유효성 검사 통과 시 실행될 함수 정의
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // 구조분해 할당 -> passwordCheck은 빼고 나머지 정보만 콘솔로 프린트
        const { passwordCheck, ...rest } = data;
        try {
            const response = await postSignup(rest);
            console.log("회원가입 성공", response);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Axios 에러일 경우, 서버 응답 정보(status, data)를 찍어본다
                console.error("❌ Axios 에러 발생:", error.response?.status); // HTTP 상태 코드 (400, 404, 500 등)
                console.error(
                    "❌ 서버 응답 에러 데이터:",
                    error.response?.data
                ); // 서버가 보낸 에러 메시지
            } else {
                console.log("예상치 못한 에러!");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    {...register("email")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]
                    ${
                        errors?.email
                            ? "border-red-500 bg-red-200"
                            : "border-gray-300"
                    }
                    `}
                    name="email"
                    type={"email"}
                    placeholder={"이메일"}
                />
                {/* 에러처리 부분 */}
                {errors.email && (
                    <div className={"text-red-500 text-sm"}>
                        {errors.email.message}
                    </div>
                )}

                <input
                    {...register("password")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]
                        ${
                            errors?.password
                                ? "border-red-500 bg-red-200"
                                : "border-gray-300"
                        }
                        `}
                    type={"password"}
                    placeholder={"비밀번호"}
                />
                {/* 에러처리 부분 */}
                {errors.password && (
                    <div className={"text-red-500 text-sm"}>
                        {errors.password.message}
                    </div>
                )}

                {/* password Check 부분 */}
                <input
                    {...register("passwordCheck")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]
                        ${
                            errors?.passwordCheck
                                ? "border-red-500 bg-red-200"
                                : "border-gray-300"
                        }
                        `}
                    type={"password"}
                    placeholder={"비밀번호 재확인"}
                />
                {/* 에러처리 부분 */}
                {errors.passwordCheck && (
                    <div className={"text-red-500 text-sm"}>
                        {errors.passwordCheck.message}
                    </div>
                )}

                <input
                    {...register("name")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff]
                        ${
                            errors?.name
                                ? "border-red-500 bg-red-200"
                                : "border-gray-300"
                        }
                        `}
                    type={"name"}
                    placeholder={"이름"}
                />
                {/* 에러처리 부분 */}
                {errors.name && (
                    <div className={"text-red-500 text-sm"}>
                        {errors.name.message}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 text-lg hover:bg-blue-700 cursor-pointer"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default SignupPage;
