import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Board } from '../boards/board.entity';

@Entity('users') // 테이블 이름 명시 (기본적으로 클래스 이름과 동일하게 사용됨)
@Unique(['email']) // 이메일 중복 감지
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nickname: string;

    @Column({ type: 'varchar', unique: true, length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @OneToMany((type) => Board, (board) => board.user, { eager: true })
    boards: Board[];
}
