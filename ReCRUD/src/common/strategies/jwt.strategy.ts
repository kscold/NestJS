import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {UserRepository} from '../../auth/user.repository';
import {User} from '../../entities/user.entity';
import process from "node:process";


@Injectable() // 다른곳에서도 주입을 하기 위해 사용
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // jwt를 Header에서 Bearer를 통해 가져오는 것으로 확인
        });
    }

    // 자동으로 검증하는 validate 메서드
    async validate(payload) {
        const {nickname} = payload;
        const user: User = await this.userRepository.findOne({where: {nickname}});

        if (!User) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
