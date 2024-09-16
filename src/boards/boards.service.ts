import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum'; // uuid의 v1 버전을 사용함

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ) {}

    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto);
    }

    async getAllBoards(): Promise<Board[]> {
        return await this.boardRepository.find();
    }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne({ where: { id } });

        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete(id);

        // 삭제를 못했을 시에는 affected === 0이므로 NotFoundException 404 오류를 반환
        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        console.log('result', result);
    }
}
