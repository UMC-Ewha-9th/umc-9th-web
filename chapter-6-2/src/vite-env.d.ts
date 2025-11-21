interface ImportMetaEnv {
  DEV: any;
  readonly VITE_SERVER_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
