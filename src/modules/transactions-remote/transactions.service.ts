import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, MongoRepository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRemote } from './entities/transaction.entity';
import {
  Filtering,
  getOrderClause,
  getWhereClause,
  Pagination,
  Sorting,
} from '../../commons/request';
import { PaginatedResource } from '../../commons/response';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(TransactionRemote)
    readonly repository: MongoRepository<TransactionRemote>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionRemote> {
    return this.repository.save(createTransactionDto);
  }

  async findAll(options: {
    pagination?: Pagination;
    sort?: Sorting;
    filter?: Filtering[];
  }): Promise<PaginatedResource<TransactionRemote>> {
    const where =
      options.filter && options.filter.length > 0
        ? { $and: options.filter.map(getWhereClause).filter(Boolean) }
        : {};
    const order = options.sort
      ? (getOrderClause(options.sort) as FindOptionsOrder<TransactionRemote>)
      : undefined;
    const { page, limit, size, offset } = options.pagination ?? {};
    this.logger.log(`Retrieving all transactions`, {
      options,
      where: JSON.stringify(where),
      order,
    });
    const [transactions, total] = await this.repository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
    return {
      totalItems: total,
      items: transactions,
      page: page ?? 1,
      size: size ?? 0,
    };
  }
}
