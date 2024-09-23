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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserSignupDto } from './dto/user-signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 회원 가입되었습니다.',
    })
    @ApiResponse({ status: 409, description: '이미 존재하는 이메일입니다.' })
    @HttpCode(200)
    @Post('/signup')
    async signUp(
        @Body(ValidationPipe) userSignupDto: UserSignupDto,
    ): Promise<{ message: string; statusCode: number }> {
        return this.authService.signUp(userSignupDto);
    }

    @ApiOperation({ summary: '이메일 중복 확인' })
    @ApiResponse({ status: 200, description: '이메일이 존재하는지 여부' })
    @Get('/check-email')
    checkEmail(@Query('email') email: string): Promise<boolean> {
        return this.authService.checkEmail(email);
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({
        status: 200,
        description: '정상적으로 로그인되었습니다. 토큰이 반환됩니다.',
    })
    @ApiResponse({ status: 401, description: '잘못된 인증 정보입니다.' })
    @HttpCode(200)
    @Post('/signin')
    signIn(
        @Body(ValidationPipe) authCredentialDto: UserSigninDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialDto);
    }
}
