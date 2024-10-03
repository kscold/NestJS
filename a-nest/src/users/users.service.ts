import {
    BadRequestException,
    HttpException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
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
        await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
    }
}
