import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { Comment } from './comment.entity'; // 추가

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Board, (board) => board.user, { eager: true })
    boards: Board[];

    @OneToMany(() => Comment, (comment) => comment.user, { eager: true }) // 댓글 관계 추가
    comments: Comment[];
}
