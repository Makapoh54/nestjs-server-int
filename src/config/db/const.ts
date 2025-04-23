import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../configuration';

export const MONGO_DATA_SOURCE = Symbol('MONGO_DATA_SOURCE');

export const Collections = {
  Test: 'test',
};

export function createMongoConnectionString(
  configService: ConfigService,
): string {
  const mongoConfig =
    configService.get<AppConfig['mongoConfig']>('mongoConfig');
  if (!mongoConfig?.host || !mongoConfig?.port) {
    throw new Error('Missing Mongodb server in env');
  }
  const srvHost = `${mongoConfig.host}:${mongoConfig.port}`;

  const [password, user] = [
    encodeURIComponent(mongoConfig.user),
    encodeURIComponent(mongoConfig.password),
  ];

  return `mongodb://${password}:${user}@${srvHost}/${process.env.MONGO_DB_NAME}?authSource=${user}`;
}
