import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    ValidationPipe,
    HttpCode,
    Delete,
    Patch,
    ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { Comment as CommentEntity } from '../entities/comment.entity'; // 명확하게 CommentEntity로 사용
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { CommentsService } from './comment.service';

@ApiTags('comments')
@Controller('boards/:boardId/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '댓글 작성' })
    @ApiResponse({
        status: 200,
        description: '댓글이 정상적으로 작성되었습니다.',
    })
    @HttpCode(200)
    @Post()
    async createComment(
        @Param('boardId') boardId: number,
        @Body(ValidationPipe) createCommentDto: CreateCommentDto,
        @GetUser() user: User,
    ): Promise<object> {
        return this.commentsService.createComment(
            createCommentDto,
            boardId,
            user,
        );
    }

    @ApiOperation({ summary: '게시글의 모든 댓글 조회' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 댓글을 조회했습니다.',
    })
    @Get()
    async getCommentsForBoard(
        @Param('boardId') boardId: number,
    ): Promise<CommentEntity[]> {
        return this.commentsService.getCommentsForBoard(boardId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '댓글 삭제' })
    @ApiResponse({
        status: 200,
        description: '댓글이 정상적으로 삭제되었습니다.',
    })
    @Delete('/:commentId')
    async deleteComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @GetUser() user: User,
    ): Promise<{ message: string }> {
        await this.commentsService.deleteComment(commentId, user);
        return { message: '댓글이 삭제되었습니다.' };
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '댓글 수정' })
    @ApiResponse({
        status: 200,
        description: '댓글이 정상적으로 수정되었습니다.',
    })
    @Patch('/:commentId')
    async updateComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body('content', ValidationPipe) content: string,
        @GetUser() user: User,
    ): Promise<object> {
        return this.commentsService.updateComment(commentId, content, user);
    }
}
