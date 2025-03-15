import { Body, Controller, Get, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategy/local.strategy';
import { JwtAuthGuard } from './strategy/jwt.strategy';

import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    // authorization: Basic $token
    registerUser(@Headers('authorization') token: string) {
        return this.authService.register(token);
    }

    @Public()
    @Post('login')
    // authorization: Basic $token
    loginUser(@Headers('authorization') token: string) {
        return this.authService.login(token);
    }

    @Post('token/block')
    blockToken(@Body('token') token: string) {
        return this.authService.tokenBlock(token);
    }

    @Public()
    @Post('token/access')
    async rotateAccessToken(@Headers('authorization') token: string) {
        const payload = await this.authService.parseBearerToken(token, true);

        return {
            accessToken: await this.authService.issueToken(payload, false),
        };
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login/passport')
    async loginUserPassport(@Request() req) {
        return {
            refreshToken: await this.authService.issueToken(req.user, true),
            accessToken: await this.authService.issueToken(req.user, false),
        };
    }

    @Public()
    @UseGuards(JwtAuthGuard)
    @Get('private')
    // authorization: Bearer $token
    async private(@Request() req) {
        return req.user;
    }
}
