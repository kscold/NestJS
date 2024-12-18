import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 어디서 Jwt를 추출할 것인지 정의
            ignoreExpiration: false, // 만료기간을 무시하지 않고 검증,
            secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
        });
    }

    validate(payload: any) {
        return payload;
    }
}