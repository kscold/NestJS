import { BadRequestException, Inject, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { envVariableKeys } from '../../common/const/env.const';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // Basic $token
        // Bearer $token
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            next();
            return;
        }

        const token = this.validateBearerToken(authHeader);

        const blockToken = await this.cacheManager.get(`BLOCK_TOKEN_${token}`);

        if (blockToken) {
            throw new UnauthorizedException('차단된 토큰입니다!');
        }

        const tokenKey = `TOKEN_${token}`;
        const cachedPayload = await this.cacheManager.get(tokenKey);

        if (cachedPayload) {
            console.log('---- cache run ----');
            req.user = cachedPayload;

            return next();
        }

        const decodedPayload = this.jwtService.decode(token); // 검증은 하지 않고 내용을 확인할 수 있음

        if (decodedPayload.type !== 'refresh' && decodedPayload.type !== 'access') {
            throw new UnauthorizedException('잘못된 토큰입니다!');
        }

        try {
            const secretKey =
                decodedPayload.type === 'refresh'
                    ? envVariableKeys.refreshTokenSecret
                    : envVariableKeys.accessTokenSecret;

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(secretKey),
            });

            // payload['exp'] -> epoch time seconds
            const expiryDate = +new Date(payload['exp'] * 1000);
            // payload['exp'] == 1710000000
            // payload['exp'] * 1000 == 1710000000 * 1000 = 1710000000000
            // new Date(1710000000000) == Sun Mar 10 2024 05:20:00 GMT+0000
            // +new Date(1710000000000) == 1710000000000
            const now = +Date.now(); // 1709999940000

            const differenceInSeconds = (expiryDate - now) / 1000; // 초로 변환
            // (expiryDate - now) / 1000 == 60000 / 1000 = 60

            // TTL를 -30초를 해서 안전시간을 확보, 최대 0.001초로 설정해서 오류를 방지
            await this.cacheManager.set(tokenKey, payload, Math.max((differenceInSeconds - 30) * 1000, 1));
            // differenceInSeconds - 30 == 60 - 30 = 30
            // (differenceInSeconds - 30) * 1000 == 30 * 1000 = 30000
            // Math.max(30000, 1) == 30000

            req.user = payload;
            next();
        } catch (e) {
            // refresh 토큰용 에러
            if ((e.name = 'TokenExpiredError')) {
                throw new UnauthorizedException('토큰이 만료되었습니다.');
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
