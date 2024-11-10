import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { MovieDetail } from './movie-detail.entity';
import { Director } from '../../director/entity/director.entity';

@Entity()
export class Movie extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    genre: string;

    @OneToOne(() => MovieDetail, (movieDetail) => movieDetail.id, {
        cascade: true, // 한번에 데이터를 생성하는 방식으로 사용
    })
    @JoinColumn()
    detail: MovieDetail;

    @ManyToOne(() => Director, (director) => director.id) // director의 id로 가져옴
    director: Director;
}
