import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { Exclude } from 'class-transformer';
import { Movie } from '../../movie/entity/movie.entity';

export enum Role {
    admin, // 0
    paidUser, // 1
    user, // 2
}

@Entity()
export class User extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true }) // 응답일때에는 제외
    password: string;

    @Column({
        type: 'enum', // type을 명시적으로 지정
        enum: Role,
        default: Role.user,
    })
    role: Role;

    @OneToMany(() => Movie, (movie) => movie.creator)
    createdMovies: Movie[];
}
