/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_API_URL: string;
  /** Base URL for the forum Q&A API; routes append /verify, /question, /admin/questions. */
  readonly VITE_FORUM_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
