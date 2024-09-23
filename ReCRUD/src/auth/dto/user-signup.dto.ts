import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UserSignupDto {
    @ApiProperty({ description: '회원 닉네임', example: 'kscold' })
    @IsString()
    @IsNotEmpty({ message: '닉네임은 필수 입력 항목입니다.' })
    @MaxLength(10, { message: '닉네임은 최대 10자 이하이어야 합니다.' })
    nickname: string;

    @ApiProperty({ description: '회원 이메일', example: 'example@gmail.com' })
    @IsEmail({}, { message: '유효하지 않은 이메일 주소입니다.' })
    email: string;

    @ApiProperty({ description: '회원 비밀번호', example: 'qwer1234!' })
    @IsString()
    @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
    @MaxLength(20, { message: '비밀번호는 최대 20자 이하이어야 합니다.' })
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?~`-]*$/, {
        message: '비밀번호는 영어, 숫자, 특수문자만 허용됩니다.',
    })
    password: string;
}
