declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHANNEL_ACCESS_TOKEN: string;
      TOKEN_LINE: string;
      MONGODB_SRV: string;
    }
  }
}

export {};
