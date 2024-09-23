import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardDto {
    @ApiProperty({
        description: '수정한 게시글 제목',
        example: '수정한 게시글 제목',
    })
    @IsNotEmpty({ message: '제목은 필수 입력 항목입니다.' })
    title: string;

    @ApiProperty({ description: '수정한 게시글 내용', example: '수정한 내용' })
    @IsNotEmpty({ message: '내용은 필수 입력 항목입니다.' })
    content: string;
}
