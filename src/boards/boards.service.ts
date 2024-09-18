import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ) {}

    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto, user);
    }

    async getAllBoards(user: User): Promise<Board[]> {
        // 쿼리빌더를 사용하지 않은 코드
        // return await this.boardRepository.find({ where: { user: user } });

        // 쿼리 빌더를 사용한 코드
        const query = this.boardRepository.createQueryBuilder('board'); // createQueryBuilder를 통해 board 테이블을 선택

        // 쿼리에 WHERE절을 설정, :userId를 통해 매개변수화
        query.where('board.userId = :userId', { userId: user.id });

        const boards = await query.getMany();

        return boards;
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

    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete({ id, user }); // id와 user가 같을 때만 게시글을 삭제

        // 삭제를 못했을 시에는 affected === 0이므로 NotFoundException 404 오류를 반환
        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        console.log('result', result);
    }
}
