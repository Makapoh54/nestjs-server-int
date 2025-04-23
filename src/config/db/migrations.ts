import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { getDataSourceOptions } from './datasource';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { config } from '../configuration'; // config() is a function

const nodeEnv = process.env.NODE_ENV;
try {
  dotenv.config({
    path: path.resolve(
      process.cwd(),
      nodeEnv === 'production' || nodeEnv === 'stage'
        ? `.env.${nodeEnv}`
        : `.env`,
    ),
  });
} catch (error) {
  console.error(`Failed to load .env.${nodeEnv}:`, error);
  process.exit(1);
}

class MigrationConfigService extends ConfigService {
  constructor(private readonly values: Record<string, any>) {
    super();
  }

  override get<T = any>(key: string, defaultValue?: T): T {
    return (this.values[key] ?? super.get(key) ?? defaultValue) as T;
  }
}

export const getMigrationsDataSource = (): DataSource => {
  const configService = new MigrationConfigService(config());
  return new DataSource(getDataSourceOptions(configService));
};

export default getMigrationsDataSource();
