import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { BoardStatus } from './board-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    private logger = new Logger('BoardController'); // BoardsController에서 Logger 객체를 인스턴스화
    constructor(private boardsService: BoardsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto: CreateBoardDto, @GetUser() user: User): Promise<Board> {
        this.logger.verbose(`User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)} `);
        return this.boardsService.createBoard(createBoardDto, user);
    }

    @Get()
    getAllBoards(@GetUser() user: User): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsService.getAllBoards(user);
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
    deleteBoard(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.boardsService.deleteBoard(id, user);
    }
}
