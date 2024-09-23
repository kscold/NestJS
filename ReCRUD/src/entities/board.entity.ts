import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity'; // 추가

@Entity() // 클래스의 엔티티임을 나타내기 위해 사용됨
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.boards, { eager: false })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.board, { eager: true })
    comments: Comment[];
}
