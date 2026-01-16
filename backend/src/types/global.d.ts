declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      REFRESH_TOKEN_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      FRONTEND_URL: string;
      SCANNER_SECRET: string;
      BUN_ENV: "development" | "production" | "test";
    }
  }
}

export {};
