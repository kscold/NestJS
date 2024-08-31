import { Controller } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  // 이후 property를 선언해주어야 함
  boardsService: BoardsService;

  // 생성자 parameter 주입
  constructor(boardsService: BoardsService) {
    this.boardsService = boardsService; // parameter를 property화
  }
}
