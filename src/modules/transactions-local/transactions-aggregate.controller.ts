import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { TransactionLocal } from './entities/transaction.entity';
import { TransactionType } from '../../config';
import { ApiResponse, PaginatedResource } from '../../commons/response';
import { UserBalanceDto } from './dto/user-balance.dto';
import { UserPayoutDto } from './dto/user-payout.dto';

@Controller('transactions-local')
export class TransactionsAggregateController {
  constructor(
    @InjectRepository(TransactionLocal)
    private readonly transactionRepo: MongoRepository<TransactionLocal>,
  ) {}

  @Get('users/:userId/balance')
  @ApiResponse(UserBalanceDto)
  async getUserAggregate(@Query('userId') userId: string) {
    const transactions = await this.transactionRepo.find({ where: { userId } });

    const { earned, spent, payout } = transactions.reduce(
      (acc, tx) => {
        switch (tx.type) {
          case TransactionType.EARNED:
            acc.earned += tx.amount;
            break;
          case TransactionType.SPENT:
            acc.spent += tx.amount;
            break;
          case TransactionType.PAYOUT:
            acc.payout += tx.amount;
            break;
        }
        return acc;
      },
      { earned: 0, spent: 0, payout: 0 },
    );
    const balance = earned - spent - payout;

    return {
      userId,
      balance,
    };
  }

  @Get('users/payouts')
  @ApiResponse(UserPayoutDto, PaginatedResource)
  // TODO implement pagination from commons request
  async getRequestedPayouts() {
    const pipeline = [
      { $match: { type: TransactionType.PAYOUT } },
      {
        $group: {
          _id: '$userId',
          amount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          amount: 1,
        },
      },
    ];

    const result = await this.transactionRepo.aggregate(pipeline).toArray();
    return result;
  }
}
