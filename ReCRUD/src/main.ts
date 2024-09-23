import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule);

    // CORS 설정
    app.enableCors({
        origin: '*', // 모든 도메인 허용
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
        credentials: true, // 자격 증명 허용
    });

    // 모든 엔드포인트에 /api가 선행되도록 설정
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('용찬이 백엔드 개발 요청 API 문서')
        .setDescription('김승찬이 빠르게 백엔드(NestJS) 외주 개발해줌')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // const port = process.env.SERVER_PORT;
    const port = 8080;

    await app.listen(port);
    logger.log(`서버 포트가 ${port}에서 작동중입니다.`);
}

bootstrap();
