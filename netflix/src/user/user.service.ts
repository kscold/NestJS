import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import bcrypt from 'bcrypt';
import { envVariableKeys } from '../common/const/env.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly configService: ConfigService,
    ) {}

    // create(createUserDto: CreateUserDto) {
    //     return this.userRepository.save(createUserDto);
    // }

    async create(createUserDto: CreateUserDto) {
        // console.log(createUserDto.email, createUserDto.password); // 수정된 부분
        // const user = this.userRepository.create(createUserDto);
        //
        // return await this.userRepository.save(user);

        const { email, password } = createUserDto;

        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (user) {
            throw new BadRequestException('이미 가입한 이메일 입니다!');
        }

        // this.configService.get<number>(envVariableKeys.hashRounds);
        const hash = await bcrypt.hash(password, 10);

        console.log(hash);

        await this.userRepository.save({
            email,
            password: hash,
        });

        return this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    findAll() {
        return this.userRepository.find();
    }

    findOne(id: number) {
        return this.userRepository.findOne({
            where: { id },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException('존재하지 않는 사용자입니다.');
        }

        await this.userRepository.update({ id }, updateUserDto);

        return this.userRepository.findOne({ where: { id } });
    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }
}
