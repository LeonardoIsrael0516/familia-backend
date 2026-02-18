import { IsString, IsIn, IsOptional, IsDateString } from 'class-validator';

export class AddSubscriptionDto {
  @IsString()
  planId: string;

  @IsIn(['monthly', 'semiannual', 'annual'])
  periodType: 'monthly' | 'semiannual' | 'annual';

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
