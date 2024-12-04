import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { LocalStrategy } from './strategy/local.strategy';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService], // AuthModule를 다른 곳에서 Inject를 해줬을 때 AuthService도 같이 Inject 받을 수 있음
})
export class AuthModule {}
