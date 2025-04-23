import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  PaginatedResource,
  ResponseDto,
} from '../../commons/response/response.dto';
import { TransactionLocal } from './entities/transaction.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionsApiService {
  private readonly logger = new Logger(TransactionsApiService.name);

  constructor(private readonly http: HttpService) {}

  async fetchTransactions({
    startDate,
    page,
    size,
  }): Promise<TransactionLocal[]> {
    const sort = 'createdAt:asc';
    const url =
      `http://host.docker.internal:3000/transactions-remote?` +
      `page=${page}&size=${size}` +
      `&sort=${encodeURIComponent(sort)}` +
      `&filter=${encodeURIComponent(`createdAt:gte:${startDate}`)}`;

    const response = await firstValueFrom(
      this.http.get<ResponseDto<PaginatedResource<TransactionLocal>>>(url),
    );
    return response.data?.result?.items || [];
  }

  async fetchEarliestTransaction(): Promise<TransactionLocal | null> {
    try {
      const url =
        `http://host.docker.internal:3000/transactions-remote?` +
        `page=0&size=1&sort=${encodeURIComponent('createdAt:asc')}`;
      const response = await firstValueFrom(
        this.http.get<ResponseDto<PaginatedResource<TransactionLocal>>>(url),
      );
      const data = response.data;
      if (
        data?.result?.items &&
        Array.isArray(data.result.items) &&
        data.result.items.length > 0
      ) {
        return data.result.items[0];
      }
      return null;
    } catch (error) {
      this.logger.error('Error fetching earliest transaction:', error);
      return null;
    }
  }
}
