import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import process from 'node:process';
import { join } from 'path';
import Joi from 'joi';
import winston from 'winston';

import { envVariableKeys } from './common/const/env.const';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';
import { AuthGuard } from './auth/guard/auth.guard';
import { RBACGuard } from './auth/guard/rbac.guard';
import { ResponseTimeInterceptor } from './common/interceptor/response-time.interceptor';
import { ThrottleInterceptor } from './common/interceptor/throttle.interceptor';
import { ForbiddenExceptionFilter } from './common/filter/forbidden.filter';
import { QueryFailedExceptionFilter } from './common/filter/query-failed.filter';

import { Movie } from './movie/entity/movie.entity';
import { MovieDetail } from './movie/entity/movie-detail.entity';
import { Director } from './director/entity/director.entity';
import { Genre } from './genre/entity/genre.entity';
import { User } from './user/entity/user.entity';
import { MovieUserLike } from './movie/entity/movie-user-like.entity';

import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';
import { DirectorModule } from './director/director.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                ENV: Joi.string().valid('dev', 'prod').required(),
                DB_TYPE: Joi.string().valid('postgres').required(),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_DATABASE: Joi.string().required(),
                HASH_ROUNDS: Joi.number().required(),
                ACCESS_TOKEN_SECRET: Joi.string().required(),
                REFRESH_TOKEN_SECRET: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: configService.get<string>(envVariableKeys.dbType) as 'postgres',
                host: configService.get<string>(envVariableKeys.dbHost),
                port: configService.get<number>(envVariableKeys.dbPort),
                username: configService.get<string>(envVariableKeys.dbUsername),
                password: configService.get<string>(envVariableKeys.dbPassword),
                database: configService.get<string>(envVariableKeys.dbDatabase),
                entities: [Movie, MovieDetail, MovieUserLike, Director, Genre, User],
                synchronize: true,
                // dropSchema: true,
                extra: {
                    client_encoding: 'UTF8',
                    timezone: 'UTC',
                    application_name: 'netflix',
                    lc_messages: 'C',
                },
            }),
            inject: [ConfigService], // IoC가 useFactory에 넣어줌
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'public'),
            serveRoot: '/public/',
        }),
        CacheModule.register({ ttl: 0, isGlobal: true }),
        ScheduleModule.forRoot(),
        WinstonModule.forRoot({
            level: 'debug',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize({
                            all: true,
                        }),
                        winston.format.timestamp(),
                        winston.format.printf((info) => `${info.context} ${info.level} ${info.message}`),
                    ),
                }),
                new winston.transports.File({
                    dirname: join(process.cwd(), 'logs'),
                    filename: 'logs.log',
                    format: winston.format.combine(
                        // winston.format.colorize({
                        //     all: true,
                        // }),
                        winston.format.timestamp(),
                        winston.format.printf((info) => `${info.context} ${info.level} ${info.message}`),
                    ),
                }),
            ],
        }),
        MovieModule,
        DirectorModule,
        GenreModule,
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: RBACGuard },
        { provide: APP_INTERCEPTOR, useClass: ResponseTimeInterceptor },
        // { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
        { provide: APP_FILTER, useClass: QueryFailedExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: ThrottleInterceptor },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(BearerTokenMiddleware)
            .exclude(
                {
                    path: 'auth/login',
                    method: RequestMethod.POST,
                    // version: ['1', '2']
                },
                {
                    path: 'auth/register',
                    method: RequestMethod.POST,
                    // version: ['1', '2']
                },
            )
            .forRoutes('*');
    }
}
