import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdatePortfolioDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    links?: string[];

    @IsNumber()
    @IsOptional()
    serviceId?: number;
} 