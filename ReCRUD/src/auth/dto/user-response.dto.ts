import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
    @ApiProperty({ description: '사용자 ID' })
    @Expose()
    id: number;

    @ApiProperty({ description: '사용자 닉네임' })
    @Expose()
    nickname: string;

    @ApiProperty({ description: '사용자 이메일' })
    @Expose()
    email: string;
}
