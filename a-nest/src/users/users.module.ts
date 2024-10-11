import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers'; // 추가된 엔티티
import { ChannelMembers } from '../entities/ChannelMembers'; // 추가된 엔티티
//
// @Module({
//     imports: [
//         TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]), // 필요한 엔티티들 추가
//     ],
//     providers: [UsersService],
//     controllers: [UsersController],
//     exports: [UsersService], // 다른 모듈에서 사용하기 위해 exports
// })
// export class UsersModule {}

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]),
        forwardRef(() => AuthModule),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
