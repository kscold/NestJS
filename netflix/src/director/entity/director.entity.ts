import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { Movie } from '../../movie/entity/movie.entity';

@Entity()
export class Director extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    dob: string;

    @Column()
    nationality: string;

    @OneToMany(() => Movie, (movie) => movie.director)
    movies: Movie[];
}
