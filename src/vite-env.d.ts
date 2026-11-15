/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_API_URL: string;
  readonly VITE_ENABLE_COMMENTS?: string;
  readonly VITE_COMMENTS_API_URL: string;
  readonly VITE_AUTH_POOL_ID: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
