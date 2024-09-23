import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from '../entities/user.entity';
import { BoardResponseDto } from './dto/board-response.dto';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ) {}

    // 게시글 생성 로직
    async createBoard(
        createBoardDto: CreateBoardDto,
        user: User,
    ): Promise<{ board: BoardResponseDto }> {
        const { title, content } = createBoardDto;

        const board = this.boardRepository.create({
            title,
            content,
            user,
        });

        await this.boardRepository.save(board);

        const userResponse: UserResponseDto = plainToClass(
            UserResponseDto,
            user,
            { excludeExtraneousValues: true },
        );
        const boardResponse: BoardResponseDto = {
            id: board.id,
            title: board.title,
            content: board.content,
            user: userResponse,
        };

        return { board: boardResponse };
    }

    // 게시글 삭제 (본인 게시글만 삭제)
    async deleteBoard(id: number, user: User): Promise<{ message: string }> {
        const result = await this.boardRepository.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return { message: '게시글이 삭제되었습니다.' };
    }

    // 게시글 수정 (본인 게시글만 수정)
    async updateBoard(
        id: number,
        updateBoardDto: UpdateBoardDto,
        user: User,
    ): Promise<BoardResponseDto> {
        const { title, content } = updateBoardDto;

        const board = await this.getBoardById(id, user);

        board.title = title;
        board.content = content;

        await this.boardRepository.save(board);

        const userResponse: UserResponseDto = plainToClass(
            UserResponseDto,
            user,
            { excludeExtraneousValues: true },
        );
        return {
            id: board.id,
            title: board.title,
            content: board.content,
            user: userResponse,
        };
    }

    // 전체 게시글 조회
    async getAllBoards(user: User): Promise<BoardResponseDto[]> {
        const boards = await this.boardRepository.find({ relations: ['user'] });

        // 모든 게시글과 작성자를 DTO로 변환
        return boards.map((board) => {
            const userResponse: UserResponseDto = plainToClass(
                UserResponseDto,
                board.user,
                { excludeExtraneousValues: true },
            );
            return {
                id: board.id,
                title: board.title,
                content: board.content,
                user: userResponse,
            };
        });
    }

    // 게시글 ID로 조회 (본인 게시글만 조회)
    async getBoardById(id: number, user: User): Promise<BoardResponseDto> {
        const board = await this.boardRepository.findOne({
            where: { id, user },
            relations: ['user'],
        });

        if (!board) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        const userResponse: UserResponseDto = plainToClass(
            UserResponseDto,
            board.user,
            { excludeExtraneousValues: true },
        );
        return {
            id: board.id,
            title: board.title,
            content: board.content,
            user: userResponse,
        };
    }
}
