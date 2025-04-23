import { DataSourceOptions } from 'typeorm';
import { createMongoConnectionString } from './const';
import { ConfigService } from '@nestjs/config';

export const getDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => {
  const connectionString = createMongoConnectionString(configService);
  return {
    type: 'mongodb',
    url: connectionString,
    synchronize: true, // TODO for dynamic index creation, should be disabled in prod
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    directConnection: true,
    migrationsRun: true,
  };
};

export const DATA_SOURCE = Symbol('DATA_SOURCE');
