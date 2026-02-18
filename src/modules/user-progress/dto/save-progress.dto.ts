import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SaveDevocionalProgressDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  dayNumber: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
