import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    // Check if service with this name already exists
    const existingService = await this.prisma.services.findFirst({
      where: { name: createServiceDto.name },
    });

    if (existingService) {
      throw new ConflictException('Service with this name already exists');
    }

    return this.prisma.services.create({
      data: createServiceDto,
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return this.prisma.services.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const service = await this.prisma.services.findUnique({
      where: { id },
      include: {
        category: true,
        portfolios:true
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    // Check if service exists
    const existingService = await this.prisma.services.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    // If name is being updated, check if it's already taken
    if (updateServiceDto.name) {
      const nameExists = await this.prisma.services.findFirst({
        where: {
          name: updateServiceDto.name,
          NOT: {
            id,
          },
        },
      });

      if (nameExists) {
        throw new ConflictException('Service with this name already exists');
      }
    }

    return this.prisma.services.update({
      where: { id },
      data: updateServiceDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    // Check if service exists
    const service = await this.prisma.services.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.services.delete({
      where: { id },
    });
  }
}
