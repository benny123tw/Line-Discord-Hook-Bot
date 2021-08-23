declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHANNEL_ACCESS_TOKEN: string;
      CHANNEL_SECRET: string;
      PORT: string;
      DISCORD_CHANNEL_URL: string;
      OWNER_ID: string;

      DC_WH_ID: string;
      DC_WH_TOKEN: string;
      MONGODB_SRV: string;
    }
  }
}

export {};
