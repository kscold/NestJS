import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { envVariableKeys } from '../common/const/env.const';

import { Role, User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    async tokenBlock(token: string) {
        const payload = this.jwtService.decode(token);

        const expiryDate = +new Date(payload['exp'] * 1000);
        const now = +new Date();

        const differenceInSeconds = (expiryDate - now) / 1000;

        await this.cacheManager.set(`BLOCK_TOKEN_${token}`, payload, Math.max(differenceInSeconds * 1000, 1));

        return true;
    }

    parseBasicToken(rawToken: string) {
        // 1. 토큰을 띄어쓰기 기준으로 스플릿 한 후 토큰 값만 추출하기
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [basic, token] = basicSplit;

        if (basic.toLowerCase() !== 'basic') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        // 2. 추출한 토큰을 base64 디코딩해서 이메일과 비밀번호를 나눔
        const decoded = Buffer.from(token, 'base64').toString('utf-8');

        // "email:password"
        const tokenSpilt = decoded.split(':');

        if (tokenSpilt.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [email, password] = tokenSpilt;

        return { email, password };
    }

    async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== 'bearer') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        try {
            // verifyAsync는 가져오면서 검증도 함
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(
                    isRefreshToken ? envVariableKeys.refreshTokenSecret : envVariableKeys.accessTokenSecret,
                ),
            });

            if (isRefreshToken) {
                if (payload.type !== 'refresh') {
                    throw new BadRequestException('Refresh 토큰을 입력해주세요!');
                }
            } else {
                if (payload.type !== 'access') {
                    throw new BadRequestException('Access 토큰을 입력해주세요!');
                }
            }

            return payload;
        } catch (e) {
            throw new UnauthorizedException('토큰이 만료되었습니다!');
        }
    }

    async register(rawToken: string) {
        const { email, password } = this.parseBasicToken(rawToken);

        const user = await this.userRepository.findOne({ where: { email } });

        if (user) {
            throw new BadRequestException('이미 가입한 이메일입니다!');
        }

        console.log(this.configService.get<number>(envVariableKeys.hashRounds));

        const hash = await bcrypt.hash(password, this.configService.get<number>(envVariableKeys.hashRounds));

        await this.userRepository.save({ email, password: hash });

        return this.userRepository.findOne({ where: { email } });
    }

    async authenticate(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new BadRequestException('잘못된 로그인 정보입니다!');
        }

        const passOk = await bcrypt.compare(password, user.password);

        if (!passOk) {
            throw new BadRequestException('잘못된 로그인 정보입니다!');
        }

        return user;
    }

    async issueToken(user: { id: number; role: Role }, isRefreshToken: boolean) {
        const refreshTokenSecret = this.configService.get<string>(envVariableKeys.refreshTokenSecret);
        const accessTokenSecret = this.configService.get<string>(envVariableKeys.accessTokenSecret);

        return await this.jwtService.signAsync(
            {
                sub: user.id,
                role: user.role,
                type: isRefreshToken ? 'refresh' : 'access',
            },
            {
                secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
                expiresIn: isRefreshToken ? '24h' : 300,
            }, // 두번째 매개변수를 통해 secret를 설정가능
        );
    }

    async login(rawToken: string) {
        const { email, password } = this.parseBasicToken(rawToken);

        const user = await this.authenticate(email, password);

        return {
            refreshToken: await this.issueToken(user, true),
            accessToken: await this.issueToken(user, false),
        };
    }
}
