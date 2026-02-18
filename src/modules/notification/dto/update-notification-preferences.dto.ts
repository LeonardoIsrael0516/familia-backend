import {
  IsOptional,
  IsBoolean,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DevocionalReminderDto {
  @IsBoolean()
  enabled: boolean;

  @IsOptional()
  @IsString()
  productId?: string | null;
}

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DevocionalReminderDto)
  devocionalReminder?: DevocionalReminderDto;
}
