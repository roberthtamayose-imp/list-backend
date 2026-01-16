import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateListDto {
  @IsString()
  @MinLength(1, { message: 'O nome da lista é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

