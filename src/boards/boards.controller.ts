import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { BoardStatus } from './board-status.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    constructor(private boardsService: BoardsService) {}

    @Post('/')
    // @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto);
    }

    @Get('/')
    getAllBoards(): Promise<Board[]> {
        return this.boardsService.getAllBoards();
    }

    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        return this.boardsService.getBoardById(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(@Param('id', ParseIntPipe) id: number, @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<Board> {
        return this.boardsService.updateBoardStatus(id, status);
    }

    @Delete('/:id')
    // url 파라미터가 숫자로 제대로 오는지 숫자로 오지 않으면 ParseIntPipe를 통해서 에러를 일으킴
    deleteBoard(@Param('id', ParseIntPipe) id): Promise<void> {
        return this.boardsService.deleteBoard(id);
    }
}
