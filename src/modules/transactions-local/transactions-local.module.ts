import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncSchedulerService } from './transactions-sync-scheduler.service';
import { TransactionsApiService } from './transactions-api.service';
import { SyncMetadata } from './entities/metadata.entity';
import { TransactionLocal } from './entities/transaction.entity';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionsAggregateController } from './transactions-aggregate.controller';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([TransactionLocal, SyncMetadata]),
  ],
  controllers: [TransactionsAggregateController],
  providers: [SyncSchedulerService, TransactionsApiService],
})
export class TransactionsLocalModule {}
