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

    async findAll(title?: string) {
        if (!title) {
            return this.movieRepository.find();
        }
        return this.movieRepository.find({
            where: { title: Like(`%${title}`) }, // 앞에 와일드카드 설정
        });
    }

    async findOne(id: number) {
        const movie = await this.movieRepository.findOne({
            where: { id },
            relations: ['detail'],
        });

        if (!movie) {
            throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
        }

        return movie;
    }

    async create(createMovieDto: CreateMovieDto) {
        const movie: Movie = await this.movieRepository.save({
            title: createMovieDto.title,
            genre: createMovieDto.genre,
            detail: {
                detail: createMovieDto.detail,
            },
        });

        return movie;
    }

    async update(id: number, updateMovieDto: UpdateMovieDto) {
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

    async remove(id: number) {
        const movie = await this.movieRepository.findOne({
            where: {
                id,
            },
            relations: ['detail'],
        });

        if (!movie) {
            throw new NotFoundException('존해하지 않는 ID의 영화입니다.');
        }

        await this.movieRepository.delete(id);
        await this.movieDetailRepository.delete(movie.detail.id);

        return id;
    }
}
