import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

import * as dotenv from 'dotenv';

// dotenv로 환경 변수 로드
dotenv.config();

declare const module: any;

// async function bootstrap() {
//     const logger = new Logger();
//
//     const app = await NestFactory.create(AppModule);
//     const configService = new ConfigService();
//     const config = new DocumentBuilder()
//         .setTitle('Sleact API')
//         .setDescription('Sleact 개발을 위한 API 문서입니다.')
//         .setVersion('1.0')
//         .addCookieAuth('connect.sid')
//         .build();
//
//     const document = SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup('api', app, document);
//
//     const port = configService.get('port') || 3000;
//     await app.listen(port);
//
//     logger.log(`listening on port ${port}`);
//
//     if (module.hot) {
//         module.hot.accept();
//         module.hot.dispose(() => app.close());
//     }
// }

async function bootstrap() {
    const logger = new Logger();

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService); // ConfigService를 app에서 가져옵니다.

    const config = new DocumentBuilder()
        .setTitle('Sleact API')
        .setDescription('Sleact 개발을 위한 API 문서입니다.')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = configService.get('port') || 3000; // configService를 통해 환경 변수를 가져옵니다.
    await app.listen(port);

    logger.log(`listening on port ${port}`);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
