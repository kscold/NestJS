import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../entities/user.entity';

@Entity() // 클래스의 엔티티임을 나타내기 위해 사용됨
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne((type) => User, (user) => user.boards, { eager: false })
    user: User;
}
