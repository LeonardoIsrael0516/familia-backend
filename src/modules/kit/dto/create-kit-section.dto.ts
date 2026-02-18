import { IsString, IsEnum, IsOptional, IsObject, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { KitSectionKey } from '@prisma/client';

export class CreateKitSectionDto {
  @IsEnum(KitSectionKey, {
    message: 'sectionKey deve ser planner, worship_guide ou verse_library',
  })
  sectionKey: KitSectionKey;

  @IsString()
  title: string;

  @IsObject()
  config: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}
