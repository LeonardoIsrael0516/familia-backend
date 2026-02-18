import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CompradorDto {
  @IsString()
  email: string;

  @IsString()
  nome: string;
}

class DataDto {
  @IsString()
  transacao_id: string;

  @ValidateNested()
  @Type(() => CompradorDto)
  comprador: CompradorDto;

  @IsOptional()
  produtos_comprados?: Array<{ produto_id: string }>;
}

export class WebhookCheckoutDto {
  @IsString()
  event: string;

  @IsOptional()
  produto_id?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;
}
