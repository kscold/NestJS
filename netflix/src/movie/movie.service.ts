import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,

        @InjectRepository(MovieDetail)
        private readonly movieDetailRepository: Repository<MovieDetail>,
    ) {}

    async getManyMovies(title?: string) {
        if (!title) {
            return this.movieRepository.find();
        }
        return this.movieRepository.find({
            where: { title: Like(`%${title}`) }, // 앞에 와일드카드 설정
        });
    }

    getMovieById(id: number) {
        const movie = this.movieRepository.findOne({
            where: { id },
            relations: ['detail'],
        });

        if (!movie) {
            throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
        }

        return movie;
    }

    async createMovie(createMovieDto: CreateMovieDto) {
        const movieDetail: MovieDetail = await this.movieDetailRepository.save({
            detail: createMovieDto.detail,
        });
        const movie: Movie = await this.movieRepository.save({
            title: createMovieDto.title,
            genre: createMovieDto.genre,
            detail: movieDetail,
        });

        return movie;
    }

    async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
        const movie: Movie = await this.movieRepository.findOne({
            where: {
                id,
            },
            relations: ['detail'],
        });

        if (!movie) {
            throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
        }

        const { detail, ...movieRest } = updateMovieDto;

        await this.movieRepository.update({ id }, movieRest);

        if (detail) {
            await this.movieDetailRepository.update(
                {
                    id: movie.detail.id,
                },
                {
                    detail,
                },
            );
        }

        const newMoive = await this.movieRepository.findOne({
            where: {
                id,
            },
            relations: ['detail'],
        });

        return newMoive;
    }

    deleteMovie(id: number) {}
}
