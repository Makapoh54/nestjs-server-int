import { IsString, IsNumber } from 'class-validator';

export class UserPayoutDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;
}
