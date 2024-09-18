import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Board } from '../boards/board.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    // eager를 true로 설정해서 user 테이블에서는 Board 엔티티를 조회할 수 있음
    @OneToMany((type) => Board, (board) => board.user, { eager: true })
    boards: Board[];
}
