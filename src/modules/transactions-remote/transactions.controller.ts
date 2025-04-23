import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  Filtering,
  FilteringParams,
  PaginatedFilteredSortedRequestParams,
  Pagination,
  PaginationParams,
  Sorting,
  SortingParams,
} from '../../commons/request';
import { ApiQuery } from '@nestjs/swagger';
import {
  ApiResponse,
  PaginatedResource,
} from '../../commons/response/response.dto';
import { TransactionRemote } from './entities/transaction.entity';

const ACTIONABLE_FIELDS = ['id', 'createdAt'];

@Controller('transactions-remote')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiResponse(CreateTransactionDto, PaginatedResource)
  @ApiQuery({
    type: PaginatedFilteredSortedRequestParams,
    required: true,
  })
  async retrieveTransactions(
    @PaginationParams() pagination: Pagination,
    @SortingParams(ACTIONABLE_FIELDS)
    sort?: Sorting,
    @FilteringParams(ACTIONABLE_FIELDS)
    filter?: Filtering[],
  ): Promise<PaginatedResource<TransactionRemote>> {
    return this.transactionsService.findAll({
      pagination,
      sort,
      filter,
    });
  }
}
