import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateBadgeDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsString()
  conditionType: string;

  @IsObject()
  conditionValue: Record<string, unknown>;
}
