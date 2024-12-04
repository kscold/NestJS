import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { Exclude } from 'class-transformer';

export enum Role {
    admin = 'admin', // enum 값도 문자열로 지정
    paidUser = 'paid',
    user = 'user',
}

@Entity()
export class User extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum', // type을 명시적으로 지정
        enum: Role,
        default: Role.user,
    })
    role: Role;
}
