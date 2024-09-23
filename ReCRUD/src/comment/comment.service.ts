// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Comment as CommentEntity } from '../entities/comment.entity';
// import { Repository } from 'typeorm';
// import { CreateCommentDto } from './dto/create-comment.dto';
// import { User } from '../entities/user.entity';
// import { Board } from '../entities/board.entity';
// import { BoardRepository } from '../boards/board.repository';
// import { plainToClass } from 'class-transformer';
// import { UserResponseDto } from '../auth/dto/user-response.dto';
// import { BoardResponseDto } from '../boards/dto/board-response.dto';
//
// @Injectable()
// export class CommentsService {
//     constructor(
//         @InjectRepository(CommentEntity)
//         private commentRepository: Repository<CommentEntity>,
//         @InjectRepository(Board)
//         private boardRepository: BoardRepository,
//     ) {}
//
//     async createComment(
//         createCommentDto: CreateCommentDto,
//         boardId: number,
//         user: User,
//     ): Promise<object> {
//         const { content } = createCommentDto;
//
//         const board = await this.boardRepository.findOne({
//             where: { id: boardId },
//         });
//         if (!board) {
//             throw new NotFoundException(`게시글을 찾을 수 없습니다.`);
//         }
//
//         const comment = this.commentRepository.create({
//             content,
//             user,
//             board,
//         });
//
//         await this.commentRepository.save(comment);
//
//         // 필요한 정보만 반환하도록 변환
//         const userResponse = plainToClass(UserResponseDto, user, {
//             excludeExtraneousValues: true,
//         });
//         const boardResponse = plainToClass(BoardResponseDto, board, {
//             excludeExtraneousValues: true,
//         });
//
//         return {
//             id: comment.id,
//             content: comment.content,
//             user: userResponse,
//             board: boardResponse,
//         };
//     }
//
//     async getCommentsForBoard(boardId: number): Promise<any[]> {
//         const board = await this.boardRepository.findOne({
//             where: { id: boardId },
//             relations: ['comments', 'comments.user'], // 댓글과 댓글 작성자를 가져옴
//         });
//         if (!board) {
//             throw new NotFoundException(`게시글을 찾을 수 없습니다.`);
//         }
//
//         return board.comments.map((comment) => {
//             const userResponse = plainToClass(UserResponseDto, comment.user, {
//                 excludeExtraneousValues: true,
//             });
//
//             return {
//                 id: comment.id,
//                 content: comment.content,
//                 user: userResponse,
//             };
//         });
//     }
// }

import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment as CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../entities/user.entity';
import { Board } from '../entities/board.entity';
import { BoardRepository } from '../boards/board.repository';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { BoardResponseDto } from '../boards/dto/board-response.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(Board)
        private boardRepository: BoardRepository,
    ) {}

    async createComment(
        createCommentDto: CreateCommentDto,
        boardId: number,
        user: User,
    ): Promise<object> {
        const { content } = createCommentDto;

        const board = await this.boardRepository.findOne({
            where: { id: boardId },
        });
        if (!board) {
            throw new NotFoundException(`게시글을 찾을 수 없습니다.`);
        }

        const comment = this.commentRepository.create({
            content,
            user,
            board,
        });

        await this.commentRepository.save(comment);

        const userResponse = plainToClass(UserResponseDto, user, {
            excludeExtraneousValues: true,
        });
        const boardResponse = plainToClass(BoardResponseDto, board, {
            excludeExtraneousValues: true,
        });

        return {
            id: comment.id,
            content: comment.content,
            user: userResponse,
            board: boardResponse,
        };
    }

    async getCommentsForBoard(boardId: number): Promise<any[]> {
        const board = await this.boardRepository.findOne({
            where: { id: boardId },
            relations: ['comments', 'comments.user'],
        });
        if (!board) {
            throw new NotFoundException(`게시글을 찾을 수 없습니다.`);
        }

        return board.comments.map((comment) => {
            const userResponse = plainToClass(UserResponseDto, comment.user, {
                excludeExtraneousValues: true,
            });

            return {
                id: comment.id,
                content: comment.content,
                user: userResponse,
            };
        });
    }

    // 본인만 댓글 삭제
    async deleteComment(commentId: number, user: User): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException(`댓글을 찾을 수 없습니다.`);
        }

        // 댓글 작성자와 현재 사용자 확인
        if (comment.user.id !== user.id) {
            throw new UnauthorizedException(
                `본인이 작성한 댓글만 삭제할 수 있습니다.`,
            );
        }

        await this.commentRepository.remove(comment);
    }

    // 본인만 댓글 수정
    async updateComment(
        commentId: number,
        content: string,
        user: User,
    ): Promise<object> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException(`댓글을 찾을 수 없습니다.`);
        }

        // 댓글 작성자와 현재 사용자 확인
        if (comment.user.id !== user.id) {
            throw new UnauthorizedException(
                `본인이 작성한 댓글만 수정할 수 있습니다.`,
            );
        }

        // 댓글 내용 수정
        comment.content = content;
        await this.commentRepository.save(comment);

        const userResponse = plainToClass(UserResponseDto, comment.user, {
            excludeExtraneousValues: true,
        });

        return {
            id: comment.id,
            content: comment.content,
            user: userResponse,
        };
    }
}
