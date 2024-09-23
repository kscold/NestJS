import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment extends BaseEntity {
    @ApiProperty({ description: '댓글 ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: '댓글 내용' })
    @Column()
    content: string;

    @ApiProperty({ description: '댓글 작성자' })
    @ManyToOne(() => User, (user) => user.comments, { eager: false })
    user: User;

    @ApiProperty({ description: '댓글이 달린 게시글' })
    @ManyToOne(() => Board, (board) => board.comments, { eager: false })
    board: Board;
}
