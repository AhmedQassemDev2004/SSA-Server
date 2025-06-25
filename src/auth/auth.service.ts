import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(loginDto: LoginDto): Promise<{ user: Partial<User>; accessToken: string }> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);

        const { password, ...userData } = user;

        return {
            user: userData,
            accessToken,
        };
    }

    async register(createUserDto: CreateUserDto): Promise<{ user: Partial<User>; accessToken: string }> {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);

        const { password, ...userData } = user;

        return {
            user: userData,
            accessToken,
        };
    }

    async logout(userId: number): Promise<void> {
        // Optional: blacklist the token or log logout activity.
        // Currently stateless JWT, so logout is frontend-managed.
        return;
    }
}
