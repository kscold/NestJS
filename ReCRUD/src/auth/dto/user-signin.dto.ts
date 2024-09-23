import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserSigninDto {
    @ApiProperty({ description: '회원 이메일', example: 'example@gmail.com' })
    @IsEmail({}, { message: '유효하지 않은 이메일 주소입니다.' })
    email: string;

    @ApiProperty({ description: '회원 비밀번호', example: 'qwer1234!' })
    @IsString()
    @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
    @MaxLength(20, { message: '비밀번호는 최대 20자 이하이어야 합니다.' })
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?~`-]*$/, { message: '비밀번호는 영어와 숫자, 특수문자만 허용됩니다.' })
    password: string;
}
