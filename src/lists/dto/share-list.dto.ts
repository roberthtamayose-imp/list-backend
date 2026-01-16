import { IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class ShareListDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsBoolean()
  @IsOptional()
  canEdit?: boolean;
}

