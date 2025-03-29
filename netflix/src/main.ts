import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import crypto from 'crypto';

import { AppModule } from './app.module';

global.crypto = crypto as unknown as Crypto;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    await app.listen(8080);
}

bootstrap();
