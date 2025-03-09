import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { BaseTable } from '../../common/entity/base-table.entity';
import { Director } from '../../director/entity/director.entity';
import { MovieDetail } from './movie-detail.entity';
import { Genre } from '../../genre/entity/genre.entity';

@Entity()
export class Movie extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @ManyToMany(() => Genre, (genre) => genre.movies)
    @JoinTable()
    genres: Genre[];

    @Column({ default: 0 })
    @JoinTable()
    likeCount: number;

    @OneToOne(() => MovieDetail, (movieDetail) => movieDetail.id, {
        cascade: true, // 한번에 데이터를 생성하는 방식으로 사용
        nullable: false, // 값이 null이 될 수 없도록 설정 즉, 선행되도록 만듬
    })
    @JoinColumn()
    detail: MovieDetail;

    @Column()
    @Transform(({ value }) => `http://localhost:8080/${value}`)
    movieFilePatch: string;

    @ManyToOne(() => Director, (director) => director.id, {
        cascade: true,
        nullable: false, // 값이 null이 될 수 없도록 설정 즉, 선행되도록 만듬
    }) // director의 id로 가져옴
    director: Director;
}
