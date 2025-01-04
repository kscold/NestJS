import { PickType } from '@nestjs/mapped-types';
import { Role, User } from '../entities/user.entity';

import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto extends PickType(User, ['email', 'password'] as const) {
    @IsEmail()
    email: string;

    @IsString()
    @Exclude({ toPlainOnly: true })
    password: string;

    // @IsEnum({ Role })
    // @IsOptional()
    // role: Role;
}
