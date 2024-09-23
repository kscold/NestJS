import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
    @ApiProperty({
        description: '수정할 댓글 내용',
        example: '수정된 댓글 내용입니다.',
    })
    @IsNotEmpty({ message: '댓글 내용은 필수 입력 항목입니다.' })
    content: string;
}
