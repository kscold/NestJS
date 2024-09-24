import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoardResponseDto } from './dto/board-response.dto';

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService) {}

    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '게시글 생성' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 게시글이 생성한 경우',
        schema: {
            properties: {
                board: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            example: 1,
                        },
                        title: {
                            type: 'string',
                            example: '첫 번째 게시글',
                        },
                        content: {
                            type: 'string',
                            example: '게시글 내용입니다.',
                        },
                        user: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'number',
                                    example: 2,
                                },
                                nickname: {
                                    type: 'string',
                                    example: 'id가 2인 사용자',
                                },
                                email: {
                                    type: 'string',
                                    example: 'id가 2인 사용자의 이메일',
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @Post()
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User,
    ): Promise<object> {
        return this.boardsService.createBoard(createBoardDto, user);
    }

    @ApiOperation({ summary: '모든 게시글 조회' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 게시글이 조회한 경우',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 1,
                    },
                    title: {
                        type: 'string',
                        example: '첫 번째 게시글',
                    },
                    content: {
                        type: 'string',
                        example: '게시글 내용입니다.',
                    },
                    user: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                example: 2,
                            },
                            nickname: {
                                type: 'string',
                                example: 'id가 2인 사용자',
                            },
                            email: {
                                type: 'string',
                                example: 'id가 2인 사용자의 이메일',
                            },
                        },
                    },
                },
            },
        },
    })
    @Get()
    async getAllBoards(@GetUser() user: User): Promise<BoardResponseDto[]> {
        return this.boardsService.getAllBoards(user);
    }

    @ApiOperation({ summary: '게시글 ID로 조회' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 특정 게시글이 조회한 경우',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    example: 1,
                },
                title: {
                    type: 'string',
                    example: '첫 번째 게시글',
                },
                content: {
                    type: 'string',
                    example: '게시글 내용입니다.',
                },
                user: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            example: 2,
                        },
                        nickname: {
                            type: 'string',
                            example: '사용자1',
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: '특정 게시글을 찾을 수 없는 경우',
    })
    @Get('/:id')
    async getBoardById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<BoardResponseDto> {
        return this.boardsService.getBoardById(id, user);
    }

    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '게시글 삭제' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 게시글을 삭제한 경우',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    example: '게시글이 삭제되었습니다.',
                },
            },
        },
    })
    @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
    @ApiResponse({
        status: 401,
        description: '인증 실패로 게시글을 삭제할 수 없는 경우',
    })
    @Delete('/:id')
    async deleteBoard(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<{ message: string }> {
        return this.boardsService.deleteBoard(id, user);
    }

    @UseGuards(AuthGuard())
    @ApiOperation({ summary: '게시글 수정' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 게시글이 수정되었습니다.',
        schema: {
            properties: {
                id: {
                    type: 'number',
                    example: 1,
                },
                title: {
                    type: 'string',
                    example: '수정된 게시글 제목',
                },
                content: {
                    type: 'string',
                    example: '수정된 게시글 내용입니다.',
                },
                user: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            example: 2,
                        },
                        nickname: {
                            type: 'string',
                            example: '사용자1',
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
    @Patch('/:id')
    async updateBoard(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
        @GetUser() user: User,
    ): Promise<BoardResponseDto> {
        return this.boardsService.updateBoard(id, updateBoardDto, user);
    }
}
