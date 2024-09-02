import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board, BoardStatus } from './boards.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService) {}

    @Get('/')
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }

    @Post('/')
    @UsePipes(ValidationPipe) // 유효성 검사를 Handler-level 파이프로 설정함
    createBoard(@Body() createBoardDto: CreateBoardDto): Board {
        return this.boardsService.createBoard(createBoardDto);
    }

    @Get('/:id')
    getBoardById(@Param('id') id: string): Board {
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id') id: string): void {
        this.boardsService.deleteBoard(id);
    }

    // PUBLIC인지 PRIVATE인지 status를 변경하는 API
    // 일부만 업데이트 하기 때문에 PATCH를 사용함
    @Patch('/:id/status')
    // parameter level에서 커스텀 파이프르 삽입함
    updateBoardStatus(@Param('id') id: string, @Body('status', BoardStatusValidationPipe) status: BoardStatus): Board {
        return this.boardsService.updateBoarStatus(id, status);
    }
}
