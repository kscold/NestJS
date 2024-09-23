import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from '../../auth/dto/user-response.dto';

export class BoardResponseDto {
    @ApiProperty({ description: '게시글 ID' })
    @Expose()
    id: number;

    @ApiProperty({ description: '게시글 제목' })
    @Expose()
    title: string;

    @ApiProperty({ description: '게시글 내용' })
    @Expose()
    content: string;

    @ApiProperty({ description: '작성자 정보' })
    @Expose()
    user: UserResponseDto;
}
