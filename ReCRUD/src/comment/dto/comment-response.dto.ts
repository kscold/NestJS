import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../auth/dto/user-response.dto';

export class CommentResponseDto {
    @ApiProperty({ description: '댓글 ID' })
    id: number;

    @ApiProperty({ description: '댓글 내용' })
    content: string;

    @ApiProperty({ description: '댓글 작성자' })
    user: UserResponseDto;

    @ApiProperty({ description: '댓글이 달린 게시글' })
    board: {
        id: number;
        title: string;
        content: string;
    };
}
