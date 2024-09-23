import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Board } from '../entities/board.entity';
import { CommentsService } from './comment.service';
import { CommentsController } from './comment.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Board])],
    providers: [CommentsService],
    controllers: [CommentsController],
})
export class CommentsModule {}
