/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
declare namespace Express {
  interface Request {
    user?: User,
    session?: Session
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    DB_USER: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_DATABASE: string;
    DB_PASSWORD: string;
    PORT: number;
  }
}
