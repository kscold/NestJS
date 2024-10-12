// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { Users } from '../entities/Users';
// import { WorkspaceMembers } from '../entities/WorkspaceMembers';
// import { ChannelMembers } from '../entities/ChannelMembers';
// import { Channels } from '../entities/Channels';
// import { Workspaces } from '../entities/Workspaces';
//
// @Module({
//     imports: [
//         TypeOrmModule.forFeature([
//             Users,
//             WorkspaceMembers,
//             ChannelMembers,
//             Channels,
//             Workspaces,
//         ]), // 필요한 엔티티들 추가
//     ],
//     providers: [UsersService],
//     controllers: [UsersController],
//     exports: [UsersService], // 다른 모듈에서 사용하기 위해 exports
// })
// export class UsersModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { AuthModule } from '../auth/auth.module';
import { Workspaces } from '../entities/Workspaces';
import { Channels } from '../entities/Channels'; // AuthModule을 가져옴

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Users,
            Workspaces,
            Channels,
            WorkspaceMembers,
            ChannelMembers,
        ]),
    ],
    providers: [UsersService, WorkspaceMembers, ChannelMembers],
    controllers: [UsersController],
    exports: [UsersService], // 다른 모듈에서 사용하기 위해 exports
})
export class UsersModule {}
