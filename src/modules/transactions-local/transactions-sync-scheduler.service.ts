import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { TransactionLocal } from './entities/transaction.entity';
import { SyncMetadata } from './entities/metadata.entity';
import { TransactionsApiService } from './transactions-api.service';

@Injectable()
export class SyncSchedulerService {
  private readonly logger = new Logger(SyncSchedulerService.name);

  constructor(
    private readonly apiService: TransactionsApiService,

    @InjectRepository(TransactionLocal)
    private readonly transactionRepo: MongoRepository<TransactionLocal>,

    @InjectRepository(SyncMetadata)
    private readonly metadataRepo: MongoRepository<SyncMetadata>,
  ) {}

  @Cron('*/10 * * * * *') // every 10 seconds
  async handleSync() {
    const metadata = await this.metadataRepo.findOneBy({
      type: 'transactions-sync',
    });

    let start: Date;

    if (metadata?.createdAt) {
      start = new Date(metadata.createdAt);
    } else {
      const initial = await this.apiService.fetchEarliestTransaction();
      if (!initial?.createdAt) {
        this.logger.warn('No initial transaction found in remote API');
        return;
      }
      start = new Date(initial.createdAt);
    }

    this.logger.log(`Syncing from ${start.toISOString()} forward`);

    const allFetched: TransactionLocal[] = [];
    let latestDate = start;

    for (let page = 0; page < 5; page++) {
      const items = await this.apiService.fetchTransactions({
        startDate: start.toISOString(),
        page,
        size: 1000,
      });

      if (items.length === 0) break;

      allFetched.push(...items);

      const lastItem = items[items.length - 1];
      if (lastItem?.createdAt) {
        latestDate = new Date(lastItem.createdAt);
      }

      if (items.length < 1000) break;
    }

    if (allFetched.length > 0) {
      await this.transactionRepo.insertMany(allFetched);
    }

    if (latestDate.getTime() <= start.getTime()) {
      this.logger.warn('Sync stalled: latestDate not advanced');
      return;
    }

    const advancedDate = new Date(latestDate.getTime() + 1);

    const newMetadata: SyncMetadata = {
      id: metadata?.id ?? new ObjectId().toHexString(),
      type: 'transactions-sync',
      createdAt: advancedDate,
      fetchedAt: new Date(),
      requestsMade: Math.ceil(allFetched.length / 1000),
      itemsPulled: allFetched.length,
    };

    await this.metadataRepo.updateOne(
      { type: 'transactions-sync' },
      { $set: newMetadata },
      { upsert: true },
    );

    this.logger.log(
      `Fetched ${allFetched.length} transactions until ${latestDate.toISOString()}, next cursor: ${advancedDate.toISOString()}`,
    );
  }
}
