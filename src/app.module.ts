import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PrismaModule} from './prisma/prisma.module';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {JwtModule} from "@nestjs/jwt";
import {ServicesModule} from './services/services.module';
import {UploadModule} from './upload/upload.module';
import {CategoriesModule} from './categories/categories.module';
import {PortfolioModule} from './portfolio/portfolio.module';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {JwtAuthGuard} from './auth/jwt-auth.guard';
import * as Joi from 'joi';
import {ContactsModule} from './contacts/contacts.module';
import {ServiceOrdersModule} from './service-orders/service-orders.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test')
                    .default('development'),
                PORT: Joi.number().default(3000),
                JWT_SECRET: Joi.string().default('default-secret-key-change-in-production'),
                JWT_EXPIRES_IN: Joi.string().default('1h'),
                DATABASE_URL: Joi.string().required(),
            }),
        }),
        PrismaModule,
        UserModule,
        AuthModule,
        JwtModule,
        ServicesModule,
        UploadModule,
        CategoriesModule,
        PortfolioModule,
        ContactsModule,
        ServiceOrdersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
