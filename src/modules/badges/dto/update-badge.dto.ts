import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateBadgeDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  conditionType?: string;

  @IsOptional()
  @IsObject()
  conditionValue?: Record<string, unknown>;
}
