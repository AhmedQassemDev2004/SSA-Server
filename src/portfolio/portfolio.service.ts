import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createPortfolioDto: CreatePortfolioDto) {
        // Check if service exists
        const service = await this.prisma.services.findUnique({
            where: { id: createPortfolioDto.serviceId },
        });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        const data: any = {
            title: createPortfolioDto.title,
            images: createPortfolioDto.images,
            links: createPortfolioDto.links || [],
            service: {
                connect: {
                    id: createPortfolioDto.serviceId
                }
            }
        };

        if (createPortfolioDto.description !== undefined) {
            data.description = createPortfolioDto.description;
        }

        return this.prisma.portfolio.create({
            data,
            include: {
                service: true,
            },
        });
    }

    async findAll() {
        return this.prisma.portfolio.findMany({
            include: {
                service: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id },
            include: {
                service: true,
            },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        return portfolio;
    }

    async update(id: number, updatePortfolioDto: UpdatePortfolioDto) {
        // Check if portfolio exists
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        // If serviceId is being updated, check if the service exists
        if (updatePortfolioDto.serviceId) {
            const service = await this.prisma.services.findUnique({
                where: { id: updatePortfolioDto.serviceId },
            });

            if (!service) {
                throw new NotFoundException('Service not found');
            }
        }

        // Prepare update data
        const updateData: any = {};

        if (updatePortfolioDto.title !== undefined) {
            updateData.title = updatePortfolioDto.title;
        }
        // if (updatePortfolioDto.description) {
        updateData.description = (updatePortfolioDto.description=="" ? " " : updatePortfolioDto.description);
        // }

        if (updatePortfolioDto.images !== undefined) {
            updateData.images = updatePortfolioDto.images;
        }
        if (updatePortfolioDto.links !== undefined) {
            updateData.links = updatePortfolioDto.links;
        }

        // If serviceId is provided, update the service relationship
        if (updatePortfolioDto.serviceId) {
            updateData.service = {
                connect: {
                    id: updatePortfolioDto.serviceId
                }
            };
        }

        return this.prisma.portfolio.update({
            where: { id },
            data: updateData,
            include: {
                service: true,
            },
        });
    }

    async remove(id: number) {
        // Check if portfolio exists
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        return this.prisma.portfolio.delete({
            where: { id },
        });
    }
} 