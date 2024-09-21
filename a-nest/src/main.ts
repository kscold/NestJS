import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
    const configService = new ConfigService();
    const logger = new Logger();

    const app = await NestFactory.create(AppModule);
    const port = configService.get('port') || 3000;

    const config = new DocumentBuilder()
        .setTitle('Sleact API')
        .setDescription('Sleact 개발을 위한 API 문서입니다.')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);

    logger.log(`listening on port ${port}`);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
