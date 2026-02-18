import { IsString, IsOptional, IsArray, IsInt, Min } from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  externalProductIdMonthly?: string;

  @IsOptional()
  @IsString()
  externalProductIdSemiannual?: string;

  @IsOptional()
  @IsString()
  externalProductIdAnnual?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}
