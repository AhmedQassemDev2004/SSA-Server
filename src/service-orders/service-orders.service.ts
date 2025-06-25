import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';

@Injectable()
export class ServiceOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceOrderDto: CreateServiceOrderDto) {
    return this.prisma.serviceOrder.create({
      data: {
        name: createServiceOrderDto.name,
        email: createServiceOrderDto.email,
        phone: createServiceOrderDto.phone,
        company: createServiceOrderDto.company,
        message: createServiceOrderDto.message,
        service: {
          connect: {
            id: createServiceOrderDto.serviceId,
          },
        },
      },
      include: {
        service: true,
      },
    });
  }

  async findAll() {
    return this.prisma.serviceOrder.findMany({
      include: {
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });
  }
}