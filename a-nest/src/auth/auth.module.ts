import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';
import { Module } from '@nestjs/common';
import { Users } from '../entities/Users';

@Module({
    imports: [
        PassportModule.register({ session: true }),
        TypeOrmModule.forFeature([Users]),
    ],
    providers: [AuthService, LocalStrategy, LocalSerializer],
    exports: [AuthService],
})
export class AuthModule {}
