import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class SendPushDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  body?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;
}
