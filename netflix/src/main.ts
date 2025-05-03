import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import crypto from 'crypto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';

global.crypto = crypto as unknown as Crypto;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['verbose'], // verbose 로그 위로만 보임
    });

    app.enableVersioning({
        // type: VersioningType.URI,
        // defaultVersion: ['1', '2'],
        // type: VersioningType.HEADER,
        // header: 'version',
        type: VersioningType.MEDIA_TYPE,
        key: 'v=',
    });
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
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
