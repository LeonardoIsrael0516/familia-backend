import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: 'Conteúdo não pode ser vazio' })
  @MaxLength(1000, { message: 'Conteúdo deve ter no máximo 1000 caracteres' })
  content: string;
}
