import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from '../entities/Users';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ where: { email } });

        console.log(email, password, user);

        if (!user) {
            return null;
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const { password, ...userWithoutPassword } = user; // user에서 password 속성만 빼기 위해 ...userWithoutPassword를 사용
            // delete user.password // 혹은 delete를 사용
            return userWithoutPassword;
        }

        return null;
    }
}
