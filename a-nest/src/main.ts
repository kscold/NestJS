import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

import dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/filter/httpException.filter';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// dotenv로 환경 변수 로드
dotenv.config();

declare const module: any;

async function bootstrap() {
    const logger = new Logger();

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService); // ConfigService를 app에서 가져옵니다.

    const port = configService.get('port') || 3000; // configService를 통해 환경 변수를 가져옵니다.

    app.useGlobalPipes(new ValidationPipe()); // validation이 붙은 것들이 있으면 알아서 검증을 해줌

    app.useGlobalFilters(new HttpExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('Sleact API')
        .setDescription('Sleact 개발을 위한 API 문서입니다.')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);

    // express-session 설정
    app.use(cookieParser());
    app.use(
        session({
            resave: false,
            saveUninitialized: false,
            secret: configService.get('COOKIE_SECRET') || 'yourFallbackSecret',
            cookie: {
                httpOnly: true,
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(port);
    console.log(`listening on port ${port}`);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
