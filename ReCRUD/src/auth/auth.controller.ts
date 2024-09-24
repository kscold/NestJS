import {
    Body,
    Controller,
    Post,
    ValidationPipe,
    Get,
    Query,
    HttpCode,
} from '@nestjs/common';
import { UserSigninDto } from './dto/user-signin.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserSignupDto } from './dto/user-signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({
        status: 200,
        description: '회원가입 성공',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    description: '회원 가입 완료 메시지',
                    example: '회원가입이 완료되었습니다.',
                },
                statusCode: {
                    type: 'number',
                    description: 'HTTP 상태 코드',
                    example: 200,
                },
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: '이미 존재하는 이메일',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    description: '메시지',
                    example: '이미 존재하는 이메일입니다.',
                },
                statusCode: {
                    type: 'number',
                    description: 'HTTP 상태 코드',
                    example: 409,
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: '회원가입 실패',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    description: '메시지',
                    example: '회원가입에 실패했습니다.',
                },
                statusCode: {
                    type: 'number',
                    description: 'HTTP 상태 코드',
                    example: 500,
                },
            },
        },
    })
    @HttpCode(200)
    @Post('/signup')
    async signUp(
        @Body(ValidationPipe) userSignupDto: UserSignupDto,
    ): Promise<{ message: string; statusCode: number }> {
        return this.authService.signUp(userSignupDto);
    }

    @ApiOperation({ summary: '이메일 중복 확인' })
    @ApiQuery({
        name: 'email',
        required: true,
        description: '중복 확인을 위한 이메일 주소',
        example: 'example@gmail.com',
    })
    @ApiResponse({
        status: 200,
        description: '이메일이 존재하는지 여부',
        schema: {
            properties: {
                exists: {
                    type: 'boolean',
                    description: '이메일 중복 여부 확인',
                    example: false,
                },
            },
        },
    })
    @Get('/check-email')
    async checkEmail(
        @Query('email') email: string,
    ): Promise<{ exists: boolean }> {
        const emailExists = await this.authService.checkEmail(email);

        return {
            exists: emailExists.exists,
        };
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({
        status: 200,
        description: '로그인 성공 및 토큰 반환',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    description: '로그인 완료 메시지',
                    example: '로그인되었습니다.',
                },
                statusCode: {
                    type: 'number',
                    description: 'HTTP 상태 코드',
                    example: 200,
                },
                accessToken: {
                    type: 'string',
                    description: 'JWT 토큰',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: '로그인 실패',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    description: '메시지',
                    example: '잘못된 인증 정보입니다.',
                },
                statusCode: {
                    type: 'number',
                    description: 'HTTP 상태 코드',
                    example: 401,
                },
            },
        },
    })
    @Post('/signin')
    async signIn(
        @Body(ValidationPipe) userSigninDto: UserSigninDto,
    ): Promise<{ message: string; statusCode: number; accessToken: string }> {
        return this.authService.signIn(userSigninDto);
    }
}
