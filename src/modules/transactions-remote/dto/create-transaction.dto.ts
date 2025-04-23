import {
  IsUUID,
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '../../../config';

export class CreateTransactionDto {
  @IsUUID()
  id: string;

  @IsString()
  userId: string;

  @IsDateString()
  createdAt: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  amount: number;
}
