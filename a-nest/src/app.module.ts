import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    // implements를 하였기 때문에 configure 메서드를 무조건 구현을 해야함
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
