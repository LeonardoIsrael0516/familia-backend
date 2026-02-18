import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDevocionalDayDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  dayNumber?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  theme?: string;

  @IsOptional()
  @IsString()
  verse?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  wordOriginal?: string;

  @IsOptional()
  @IsString()
  wordMeaning?: string;

  @IsOptional()
  @IsString()
  reflection?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questions?: string[];

  @IsOptional()
  @IsString()
  audioPrayerUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}
