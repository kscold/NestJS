import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(WorkspaceMembers)
        private workspaceMembersRepository: Repository<WorkspaceMembers>, // WorkspaceMembers 리포지토리 추가
        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,
    ) {}

    async join(email: string, nickname: string, password: string) {
        // validation을 엔티티에 했기 때문에 알아서 에러처리가 됨
        // if (!email) {
        //     // 이메일 없다고 에러
        //     throw new HttpException('이메일이 없네요', 400);
        // }
        // if (!nickname) {
        //     throw new HttpException('닉네임이 없네요', 400);
        // }
        // if (!password) {
        //     throw new BadRequestException('비밀번호가 없네요');
        // }

        const user = await this.usersRepository.findOne({ where: { email } });

        // 이미 존재하는 유저라고 에러
        if (user) {
            throw new UnauthorizedException('이미 존재하는 사용자입니다.'); // thorw되면 아래 기능은 실행되지 않음
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const returned = await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });

        await this.workspaceMembersRepository.save({
            UserId: returned.id,
            WorkspaceId: 1,
        });
        await this.channelMembersRepository.save({
            UserId: returned.id,
            WorkspaceId: 1,
        });
    }
}
