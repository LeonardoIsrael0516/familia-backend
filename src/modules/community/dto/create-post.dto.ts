import { IsString, MinLength, MaxLength, IsOptional, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1, { message: 'Conteúdo não pode ser vazio' })
  @MaxLength(2000, { message: 'Conteúdo deve ter no máximo 2000 caracteres' })
  content: string;

  @IsOptional()
  @IsUrl({}, { message: 'imageUrl deve ser uma URL válida' })
  imageUrl?: string;
}
