import { IsString, IsOptional, IsUrl, MaxLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @ValidateIf((_, v) => v != null && v !== '')
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  avatarUrl?: string | null;
}
