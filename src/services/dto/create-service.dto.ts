import { IsNotEmpty, IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateServiceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsNumber()
    @IsOptional()
    categoryId?: number;
}
