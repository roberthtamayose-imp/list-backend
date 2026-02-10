import {
    IsString,
    IsNumber,
    IsOptional,
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

export class CreateRegisteredItemDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0.01, { message: 'A quantidade deve ser maior que zero' })
    @IsOptional()
    defaultQuantity?: number;

    @IsString()
    @IsIn(UNITS, { message: 'Unidade inválida' })
    @IsOptional()
    defaultUnit?: string;

    @IsString()
    @IsIn(CATEGORIES, { message: 'Categoria inválida' })
    @IsOptional()
    category?: string;
}
