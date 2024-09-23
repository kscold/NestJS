import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            // entities: ['entities/*.js'],
            autoLoadEntities: true,
            keepConnectionAlive: true,
            synchronize: true,
            logging: true,
            charset: 'utf8mb4',
        }),
        UsersModule,
        WorkspacesModule,
        ChannelsModule,
        DmsModule,
    ],
    controllers: [AppController],
    providers: [AppService, UsersService],
})
export class AppModule implements NestModule {
    // implements를 하였기 때문에 configure 메서드를 무조건 구현을 해야함
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
