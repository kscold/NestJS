// import { PassportModule } from '@nestjs/passport';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
// import { LocalSerializer } from './local.serializer';
// import { Module } from '@nestjs/common';
// import { Users } from '../entities/Users';
//
// @Module({
//     imports: [
//         PassportModule.register({ session: true }),
//         TypeOrmModule.forFeature([Users]),
//     ],
//     providers: [AuthService, LocalStrategy, LocalSerializer],
//     exports: [AuthService],
// })
// export class AuthModule {}

import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';
import { Users } from '../entities/Users';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        PassportModule.register({ session: true }),
        TypeOrmModule.forFeature([Users]),
        forwardRef(() => UsersModule), // 순환 종속성 문제 해결을 위해 forwardRef 사용
    ],
    providers: [AuthService, LocalStrategy, LocalSerializer],
    exports: [AuthService],
})
export class AuthModule {}
