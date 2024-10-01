import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    async join(email: string, nickname: string, password: string) {
        if (!email) {
            // 이메일 없다고 에러
            throw new Error('이메일이 없네요');
        }
        if (!nickname) {
            throw new Error('닉네임이 없네요');
        }
        if (!password) {
            throw new Error('비밀번호가 없네요');
        }

        const user = await this.usersRepository.findOne({ where: { email } });

        // 이미 존재하는 유저라고 에러
        if (user) {
            throw new Error('이미 존재하는 사용자입니다.'); // thorw되면 아래 기능은 실행되지 않음
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
    }
}
