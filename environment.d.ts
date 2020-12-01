declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_USER: string;
        DB_HOST: string;
        DB_PORT: number;
        DB_DATABASE: string;
        DB_PASSWORD: string;
        PORT: number;
      }
    }
  }
  export {}