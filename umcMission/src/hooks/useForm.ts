import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValue: T; // {email : "djfilaj", password: "jfldajf"}
    // 값이 올바른지 검증하는 함수
    validate: (value: T) => Record<keyof T, string>;
}

//useForm() 함수 정의하는 부분
function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
    // values: 현재 폼의 입력값들 저장
    const [values, setValues] = useState(initialValue);
    // 사용자가 특정 입력 필드를 건드렸는지 추적. 포커스 있다가 벗어나면 오류 메시지 띄움
    const [touched, setTouched] = useState<Record<string, boolean>>();
    // 생성된 오류 메시지 저장
    const [errors, setErrors] = useState<Record<string, string>>();

    // 입력값이 바뀔 때 사용하는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values, // 불변성 유지 > 기존의 values를 가져와서
            [name]: text, // 업데이트 하고자는 부분만 변경한다.
        });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true, // 해당 필드를 touched 상태가 true로 변경
        });
    };

    // 훅의 핵심적인 부분!
    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            handleChange(name, e.target.value);
        };
        const onBlur = () => handleBlur(name);
        return { value, onChange, onBlur };
    }; // getInputProps

    // value가 검증될대마다 error검증 로직을 실행함.
    // {email :"유효한 이메일이 아닙니다"}
    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors); // 오류 메시지 업데이트
    }, [validate, values]);

    return { values, errors, touched, getInputProps };
}

export default useForm;
