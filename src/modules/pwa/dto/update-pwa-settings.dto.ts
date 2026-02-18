import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePwaSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  appName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  shortName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  themeColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  icon192Url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  icon512Url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  appleTouchIconUrl?: string;
}
