import {Injectable, ConflictException, UnauthorizedException, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ChangePasswordDto} from './dto/change-password.dto';
import {PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {User} from '../types/auth.types';

const userSelect = {
    id: true,
    email: true,
    name: true,
    phone: true,
    active: true,
    createdAt: true,
    updatedAt: true,
    role: true
};

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {email}
        });
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {email}
        });
        return user;
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {id}
        });
        return user;
    }

    async getProfile(id: number): Promise<Omit<User, 'password'> | null> {
        const user = await this.prisma.user.findUnique({
            where: {id},
            select: userSelect
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        return this.prisma.user.create({
            data: createUserDto,
        });
    }

    async findAll(): Promise<Omit<User, 'password'>[]> {
        return await this.prisma.user.findMany({
            select: userSelect
        });
    }

    async findOne(id: number): Promise<Omit<User, 'password'> | null> {
        const user = await this.prisma.user.findUnique({
            where: {id},
            select: userSelect
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // If email is being updated, check if it's already taken
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }
        }

        // If password is being updated, hash it
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return await this.prisma.user.update({
            where: {id},
            data: updateUserDto,
            select: userSelect
        });
    }

    async updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if email is being updated and if it's already taken
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }
        }

        // If password is being updated, hash it
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return await this.prisma.user.update({
            where: {id: userId},
            data: updateUserDto,
            select: userSelect
        });
    }

    async remove(id: number): Promise<Omit<User, 'password'>> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return await this.prisma.user.delete({
            where: {id},
            select: userSelect
        });
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<Omit<User, 'password'>> {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.validatePassword(
            changePasswordDto.currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

        return await this.prisma.user.update({
            where: {id: userId},
            data: {
                password: hashedNewPassword,
                updatedAt: new Date()
            },
            select: userSelect
        });
    }
}
