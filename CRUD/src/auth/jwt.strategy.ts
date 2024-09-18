import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity'; // 전략 사용은 일반 passport가 아니라 passport-jwt로 사용
import * as config from 'config';

@Injectable() // 다른곳에서도 주입을 하기 위해 사용
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'), // 토큰을 유효한지 체크할 때 사용하는 Secret Key임
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // jwt를 Header에서 Bearer를 통해 가져오는 것으로 확인
        });
    }

    // 자동으로 검증하는 validate 메서드
    async validate(payload) {
        const { username } = payload;
        const user: User = await this.userRepository.findOne({ where: { username } });

        if (!User) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
