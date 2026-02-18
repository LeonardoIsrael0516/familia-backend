import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDevocionalDayDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  dayNumber: number;

  @IsString()
  @MaxLength(200)
  theme: string;

  @IsString()
  verse: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  wordOriginal?: string;

  @IsOptional()
  @IsString()
  wordMeaning?: string;

  @IsString()
  reflection: string;

  @IsArray()
  @IsString({ each: true })
  questions: string[];

  @IsOptional()
  @IsString()
  audioPrayerUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}
