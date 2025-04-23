export const config = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiVersion: '1',
  mongoConfig: {
    host: process.env.MONGO_DB_HOST,
    port: parseInt(process.env.MONGO_DB_PORT || '27017', 10),
    name: process.env.MONGO_DB_NAME || '',
    user: process.env.MONGO_DB_USER || '',
    password: process.env.MONGO_DB_PASSWORD || '',
    migrationRun: (process.env.MIGRATION_RUN || 'false') === 'true',
  },
  redisConfig: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    db: parseInt(process.env.REDIS_DB || '0', 10),
    apiCacheTTL: parseInt(process.env.REDIS_API_CACHE_TTL || '60', 10),
  },
});

export type AppConfig = ReturnType<typeof config>;
