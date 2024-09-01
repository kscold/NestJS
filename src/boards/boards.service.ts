import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto'; // uuid의 v1 버전을 사용ㄴ

@Injectable()
export class BoardsService {
    // boards의 타입은 Board의 여러개이므로 리스트임
    private boards: Board[] = []; // BoardsService에서만 사용할 수 있도록

    // 모든 게시글 조회
    getAllBoards(): Board[] {
        return this.boards; // boards 리스트를 호출해서 전부 받음
    }

    // id를 통한 하나의 게시물을 조회
    getBoardById(id: string): Board {
        return this.boards.find((board) => board.id === id); // boards 배열을 순회하면서 id가 같은 값을 찾음
    }

    // 모든 게시글 조회
    createBoard(createBoardDto: CreateBoardDto) {
        const { title, description } = createBoardDto; // Dto를 사용함

        // 게시글 아이디가 없기 때문에 오류가 남
        const board: Board = {
            id: uuid(),
            title,
            description,
            status: BoardStatus.PUBLIC, // 기본값은 PUBLIC임
        };

        this.boards.push(board);
        return board; // 추가한 board를 하나를 반환
    }

    updateBoarStatus(id: string, status: BoardStatus) {
        const board = this.getBoardById(id);
        board.status = status;
        return board; // 업데이트한 board 모델을 반환
    }

    deleteBoard(id: string): void {
        this.boards = this.boards.filter((board) => board.id !== id);
    }
}
