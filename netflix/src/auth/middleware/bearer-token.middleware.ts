import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { envVariableKeys } from '../../common/const/env.const';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Basic $token
        // Bearer $token
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            next();
            return;
        }

        try {
            const token = this.validateBearerToken(authHeader);
            const decodedPayload = this.jwtService.decode(token); // 검증은 하지 않고 내용을 확인할 수 있음

            if (decodedPayload.type !== 'refresh' && decodedPayload.type !== 'access') {
                throw new UnauthorizedException('잘못된 토큰입니다!');
            }

            const secretKey =
                decodedPayload.type === 'refresh'
                    ? envVariableKeys.refreshTokenSecret
                    : envVariableKeys.accessTokenSecret;

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(secretKey),
            });

            req.user = payload;
            next();
        } catch (e) {
            // refresh 토큰용 에러
            if ((e.name = 'TokenExpiredError')) {
                // throw new UnauthorizedException('토큰이 만료되었습니다.');
                throw new ForbiddenException('토큰이 만료되었습니다.');
            }

            next();
        }
    }

    validateBearerToken(rawToken: string) {
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== 'bearer') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        return token;
    }
}
