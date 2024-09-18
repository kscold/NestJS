import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import * as process from 'node:process';

const jwtConfig = config.get('jwt');

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), // PassportModule을 통해 jwt를 등록
        JwtModule.register({
            secret: process.env.JWT_SECRET || jwtConfig.secret, // 토큰을 유효한지 체크할 때 사용하는 Secret Key임
            signOptions: {
                expiresIn: jwtConfig.expiresIn,
            },
        }),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, JwtStrategy], // 현재 모듈에서 사용할 것들을 주입
    exports: [JwtStrategy, PassportModule], // 다른 모듈에서도 사용할 수 있도록 export
})
export class AuthModule {}
