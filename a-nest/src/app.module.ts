// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { LoggerMiddleware } from './middlewares/logger.middleware';
// import { UsersModule } from './users/users.module';
// import { WorkspacesModule } from './workspaces/workspaces.module';
// import { ChannelsModule } from './channels/channels.module';
// import { DmsModule } from './dms/dms.module';
// import { UsersService } from './users/users.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import * as process from 'node:process';
// import { ChannelChats } from './entities/ChannelChats';
// import { ChannelMembers } from './entities/ChannelMembers';
// import { Channels } from './entities/Channels';
// import { DMs } from './entities/DMs';
// import { Mentions } from './entities/Mentions';
// import { Users } from './entities/Users';
// import { WorkspaceMembers } from './entities/WorkspaceMembers';
// import { Workspaces } from './entities/Workspaces';
//
// @Module({
//     imports: [
//         ConfigModule.forRoot({ isGlobal: true }),
//         TypeOrmModule.forRoot({
//             type: 'postgres',
//             host: 'localhost',
//             port: 5432,
//             username: process.env.DB_USERNAME,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_DATABASE,
//             // entities: ['./entities/*.ts'],
//             entities: [
//                 ChannelChats,
//                 ChannelMembers,
//                 Channels,
//                 DMs,
//                 Mentions,
//                 Users,
//                 WorkspaceMembers,
//                 Workspaces,
//             ],
//             // schema: 'public', // 이 라인을 아예 제거하거나 명시적으로 설정해도 됩니다.
//             autoLoadEntities: true,
//             keepConnectionAlive: true,
//             synchronize: true,
//             logging: true,
//         }),
//         UsersModule,
//         WorkspacesModule,
//         ChannelsModule,
//         DmsModule,
//     ],
//     controllers: [AppController],
//     providers: [AppService, UsersService],
// })
// export class AppModule implements NestModule {
//     // implements를 하였기 때문에 configure 메서드를 무조건 구현을 해야함
//     configure(consumer: MiddlewareConsumer): any {
//         consumer.apply(LoggerMiddleware).forRoutes('*');
//     }
// }

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
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';

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
            // 기본적으로 public 스키마를 사용하도록 설정 (schema 옵션 제거)
            entities: [
                ChannelChats,
                ChannelMembers,
                Channels,
                DMs,
                Mentions,
                Users,
                WorkspaceMembers,
                Workspaces,
            ],
            autoLoadEntities: true,
            // schema: 'public', // 명시적으로 public 스키마 설정
            keepConnectionAlive: true,
            synchronize: true, // 스키마 동기화 사용
            // synchronize: false,
            logging: true,
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
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
