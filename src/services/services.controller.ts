import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import {ServicesService} from './services.service';
import {CreateServiceDto} from './dto/create-service.dto';
import {UpdateServiceDto} from './dto/update-service.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {AdminGuard} from '../auth/admin.guard';
import {GetUser} from '../auth/get-user.decorator';
import { Public } from 'src/auth/public.decorator';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @Get()
    @Public()
    findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    @Public()
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateServiceDto: UpdateServiceDto,
    ) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.remove(id);
    }
}
