import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { LocalStrategy } from './strategy/local.strategy';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { User } from '../user/entity/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserService } from '../user/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            // 세팅 값을 사전 모듈에 넣지 않음 access와 refresh를 분기하기 위해
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
    exports: [AuthService, JwtModule], // AuthModule를 다른 곳에서 Inject를 해줬을 때 AuthService도 같이 Inject 받을 수 있음
})
export class AuthModule {}
