import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreatePortfolioDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    links?: string[];

    @IsNumber()
    @IsNotEmpty()
    serviceId: number;
} 