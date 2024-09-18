import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([BoardRepository]), AuthModule], // 리파지터리 연결
    controllers: [BoardsController], // 컨트롤러 연결
    providers: [BoardsService, BoardRepository], // 서비스 연결
})
export class BoardsModule {}
