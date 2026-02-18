import { IsString, IsEnum, IsOptional, IsObject, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { KitSectionKey } from '@prisma/client';

export class UpdateKitSectionDto {
  @IsOptional()
  @IsEnum(KitSectionKey)
  sectionKey?: KitSectionKey;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}
