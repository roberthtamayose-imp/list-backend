import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsIn,
} from 'class-validator';

const CATEGORIES = [
  'frutas',
  'vegetais',
  'carnes',
  'laticinios',
  'padaria',
  'bebidas',
  'limpeza',
  'higiene',
  'outros',
];

const UNITS = ['un', 'kg', 'g', 'L', 'ml', 'dz', 'pct', 'cx'];

export class CreateItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0.01, { message: 'A quantidade deve ser maior que zero' })
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsIn(UNITS, { message: 'Unidade inválida' })
  @IsOptional()
  unit?: string;

  @IsString()
  @IsIn(CATEGORIES, { message: 'Categoria inválida' })
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

