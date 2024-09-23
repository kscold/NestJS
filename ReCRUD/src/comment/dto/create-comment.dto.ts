import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({
        description: '댓글 내용',
        example: '좋은 게시글 감사합니다!',
    })
    @IsNotEmpty({ message: '댓글 내용은 필수 입력 항목입니다.' })
    content: string;
}
