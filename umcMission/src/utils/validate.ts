export type UserSigninInformation = {
    email: string;
    password: string;
};

export type UserSigninInformationErrors = {
    email: string;
    password: string;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// 로그인 유효성 검사

export function validateSignin(
    values: UserSigninInformation
): UserSigninInformationErrors {
    const errors: UserSigninInformationErrors = {
        email: "",
        password: "",
    };

    // 올바른 이메일 형식이 아닌 경우
    if (!EMAIL_REGEX.test(values.email)) {
        errors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 비밀번호 8~20자 사이가 아닌 경우
    if (!(values.password.length >= 8 && values.password.length <= 20)) {
        errors.password = "비밀번호는 8-20자여야 한다.";
    }

    return errors;
}
// 로그인 유효성 검사

// function validateSignin(values: UserSigninInformation) {
//     return validateUser(values);
// }

// export { validateSignin };
