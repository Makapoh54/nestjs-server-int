import { IsNumber, IsString } from 'class-validator';

export class UserBalanceDto {
  @IsString()
  userId: string;

  @IsNumber()
  balance: number;

  @IsNumber()
  earned: number;

  @IsNumber()
  spent: number;
}
