import { IsString, MinLength } from 'class-validator';

export class JoinListDto {
  @IsString()
  @MinLength(1, { message: 'Código de compartilhamento é obrigatório' })
  code: string;
}

