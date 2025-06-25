import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from '../types/auth.types';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            const { user, accessToken } = await this.authService.login(loginDto);
            return { user, accessToken };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            const { user, accessToken } = await this.authService.register(createUserDto);
            return { user, accessToken };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: RequestWithUser) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: RequestWithUser) {
        await this.authService.logout(req.user.id);
        return { message: 'Logged out successfully' };
    }
}
