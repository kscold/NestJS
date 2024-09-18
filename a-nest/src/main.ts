import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
    const configService = new ConfigService();
    const logger = new Logger();

    const app = await NestFactory.create(AppModule);
    const port = configService.get('port') || 3000;

    await app.listen(port);

    logger.log(`listening on port ${port}`);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
