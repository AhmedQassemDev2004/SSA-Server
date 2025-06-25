import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Public } from '../auth/public.decorator';

@Controller('portfolios')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    create(@Body() createPortfolioDto: CreatePortfolioDto) {
        return this.portfolioService.create(createPortfolioDto);
    }

    @Get()
    @Public()
    findAll() {
        return this.portfolioService.findAll();
    }

    @Get(':id')
    @Public()
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.portfolioService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePortfolioDto: UpdatePortfolioDto,
    ) {
        return this.portfolioService.update(id, updatePortfolioDto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.portfolioService.remove(id);
    }
} 