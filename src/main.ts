import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';

import {mkdir} from 'fs/promises';
import {join} from 'path';

async function bootstrap() {
    // Ensure uploads directory exists
    await mkdir(join(__dirname, '..', 'uploads'), {recursive: true});

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Serve static files from uploads directory
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    // Enable CORS
    app.enableCors({
        // origin: ['http://localhost:8080', 'http://localhost:5173'], // Allow both origins
        origin:'https://ssa-egypt.com',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
