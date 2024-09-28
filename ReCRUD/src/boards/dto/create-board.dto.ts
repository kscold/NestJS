import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
    @ApiProperty({
        description: '게시글 제목',
        example: '게시글 제목',
    })
    @IsNotEmpty({ message: '제목은 필수 입력 항목입니다.' })
    title: string;

    @ApiProperty({
        description: '게시글 내용',
        example: '게시글 내용',
    })
    @IsNotEmpty({ message: '내용은 필수 입력 항목입니다.' })
    content: string;
}