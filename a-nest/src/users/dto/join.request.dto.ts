import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
    @ApiProperty({
        example: 'chan6502@gmail.com',
        description: '이메일',
        required: true,
    })
    public email: string;

    @ApiProperty({
        example: 'kscold',
        description: '닉네임',
        required: true,
    })
    public nickname: string;

    @ApiProperty({
        example: 'Tmdcks6502@',
        description: '비밀번호',
        required: true,
    })
    public password: string;
}
