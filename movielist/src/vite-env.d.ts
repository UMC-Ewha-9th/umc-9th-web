interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TMDB_ACCESS_TOKEN: string
    // 다른 환경 변수들도 여기에 추가
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }