import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from '../../user/entities/user.entity';

/*
 * [Like] [Dislike]
 *
 * 아무것도 누르지 않은 상태
 * Like & Dislike 모두 버튼 꺼져있음
 *
 * Like 버튼 누르면
 * Like 버튼 불 켜짐
 *
 * Like 버튼 다시 누르면
 * Like 버튼 불 꺼짐
 *
 * DisLike 버튼 누르면
 * DisLike 버튼 불 켜짐
 *
 * DisLike 버튼 다시 누르면
 * DisLike 버튼 불 꺼짐
 *
 * Like 버튼 누름
 * Like 버튼 불 켜짐
 *
 * Dislike 버튼 누름
 * Like 버튼 불 꺼지고 Dislike 버튼 불 켜짐
 */

@Entity()
export class MovieUserLike {
    @PrimaryColumn({
        name: 'movieId',
        type: 'int8',
    })
    @ManyToOne(() => Movie, (movie) => movie.likedUsers)
    movie: Movie;

    @PrimaryColumn({
        name: 'userId',
        type: 'int8',
    })
    @ManyToOne(() => User, (user) => user.likedMovies)
    user: User;
}
