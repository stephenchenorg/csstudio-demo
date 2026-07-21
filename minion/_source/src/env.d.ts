/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly API_BASE_URL: string
  readonly GA4_TRACKING_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
