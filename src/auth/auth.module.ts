import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './jwt.strategy';
import {UserModule} from '../user/user.module';
import {JwtAuthGuard} from './jwt-auth.guard';
import {AdminGuard} from './admin.guard';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    imports: [
        UserModule,
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminGuard],
    controllers: [AuthController],
    exports: [AuthService, JwtModule, JwtStrategy, JwtAuthGuard, AdminGuard],
})
export class AuthModule {}
