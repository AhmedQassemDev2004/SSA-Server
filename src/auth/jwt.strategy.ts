import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {UserService} from '../user/user.service';
import {JwtPayload, User} from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload): Promise<Omit<User, 'password'>> {
        try {
            if (!payload.sub) {
                throw new UnauthorizedException('Invalid token payload');
            }

            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            if (!user.active) {
                throw new UnauthorizedException('User account is inactive');
            }

            const {password, ...userWithoutPassword} = user;
            return userWithoutPassword;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid token');
        }
    }
}


