import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import useRealTimers = jest.useRealTimers;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    create(createUserDto: CreateUserDto) {
        return this.userRepository.save(createUserDto);
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
