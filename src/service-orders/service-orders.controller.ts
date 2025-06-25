import { Controller, Get, Post, Body, Param, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Parser } from 'json2csv';

@Controller('service-orders')
export class ServiceOrdersController {
  constructor(private readonly serviceOrdersService: ServiceOrdersService) {}

  @Post()
  create(@Body() createServiceOrderDto: CreateServiceOrderDto) {
    return this.serviceOrdersService.create(createServiceOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.serviceOrdersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOrdersService.findOne(id);
  }

  @Get('export')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async export(@Res() res: Response) {
    const orders = await this.serviceOrdersService.findAll();
    
    const fields = [
      'id',
      'name',
      'email',
      'phone',
      'company',
      'message',
      'serviceId',
      'service.name',
      'createdAt',
      'updatedAt'
    ];
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(orders);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  }
} 