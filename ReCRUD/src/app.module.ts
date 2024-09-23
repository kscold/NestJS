import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfing } from './configs/typeorm.confing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comment/comment.module';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core'; // APP_INTERCEPTOR 추가

@Module({
    imports: [
        TypeOrmModule.forRoot(typeORMConfing), // TypeORM 설정
        MorganModule,
        BoardsModule,
        AuthModule,
        CommentsModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR, // APP_INTERCEPTOR로 Interceptor 설정
            useClass: MorganInterceptor('combined'), // 'combined' 포맷 사용
        },
    ],
})
export class AppModule {}
