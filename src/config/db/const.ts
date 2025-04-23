import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../configuration';
import { SyncMetadata } from '../../modules/transactions-local/entities/metadata.entity';
import { Transaction } from 'typeorm';

export const MONGO_DATA_SOURCE = Symbol('MONGO_DATA_SOURCE');

export const Collections = {
  TransactionsRemote: 'transactions-remote',
  TransactionsLocal: 'transactions-local',
  SyncMetadata: 'sync-metadata',
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

export enum TransactionType {
  EARNED = 'earned',
  SPENT = 'spent',
  PAYOUT = 'payout',
}
