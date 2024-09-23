import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../auth/user.repository';
import { User } from '../../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'Secret1234!', // 시크릿 키 확인
        });
    }

    async validate(payload): Promise<User> {
        console.log('JWT Payload:', payload); // payload 로그 추가
        const { email } = payload;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
