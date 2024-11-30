import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: Repository<User>) {}

    parseBasicToken(rawToken: string) {
        // 1. 토큰을 띄어쓰기 기준으로 스플릿 한 후 토큰 값만 추출하기
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [_, token] = basicSplit;

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

    async register(rawToken: string) {
        const { email, password } = this.parseBasicToken(rawToken);

        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new BadRequestException('이미 가입한 이메일입니다!');
        }

        await this.userRepository.save({ email, password });
    }
}
