import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';

@Module({
    imports: [TypeOrmModule.forFeature([Users])], // 리파지터리 인젝션
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
