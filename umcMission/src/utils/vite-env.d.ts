interface ImportMetaEnv {
    readonly VITE_SERVER_API_URL: string;
    // 다른 변수들에 대한 타입 정의
}

interface InportMeta {
    readonly env: InportMetaEnv;
}
