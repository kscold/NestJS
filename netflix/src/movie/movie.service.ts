import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';

import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entity/director.entity';
import { Genre } from '../genre/entity/genre.entity';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,

        @InjectRepository(MovieDetail)
        private readonly movieDetailRepository: Repository<MovieDetail>,

        @InjectRepository(Director)
        private readonly directorRepository: Repository<Director>,

        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,
    ) {}

    async findAll(title?: string) {
        if (!title) {
            return [
                await this.movieRepository.find({
                    relations: ['director', 'genres'],
                }),
                await this.movieRepository.count(),
            ];
        }
        return this.movieRepository.find({
            where: { title: Like(`%${title}`) }, // 앞에 와일드카드 설정
            relations: ['director', 'genres'],
        });
    }

    async findOne(id: number) {
        const movie = await this.movieRepository.findOne({
            where: { id },
            relations: ['detail', 'director', 'genres'],
        });

        if (!movie) {
            throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
        }

        return movie;
    }

    async create(createMovieDto: CreateMovieDto) {
        const director = await this.directorRepository.findOne({
            where: { id: createMovieDto.directorId },
        });

        if (!director) {
            throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
        }

        const genres = await this.genreRepository.find({
            where: {
                id: In(createMovieDto.genreIds),
            },
        });

        // 찾은 장르의 갯수가 등록하는 장르의 갯수와 같지 않으면 오류
        if (genres.length !== createMovieDto.genreIds.length) {
            throw new NotFoundException(
                `존재하지 않는 장르가 있습니다. -> ${genres.map((genre) => genre.id).join(',')}`,
            );
        }

        const movie: Movie = await this.movieRepository.save({
            title: createMovieDto.title,
            detail: {
                detail: createMovieDto.detail,
            },
            director,
            genres,
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

        const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

        let newDirector;

        if (directorId) {
            const director = await this.directorRepository.findOne({
                where: {
                    id: directorId,
                },
            });

            if (!director) {
                throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
            }

            newDirector = director;
        }

        let newGenres;
        if (genreIds) {
            const genres = await this.genreRepository.find({ where: { id: In(genreIds) } });

            if (genres.length !== updateMovieDto.genreIds.length) {
                throw new NotFoundException(
                    `존재하지 않는 장르가 있습니다. -> ${genres.map((genre) => genre.id).join(',')}`,
                );
            }

            newGenres = genres;
        }

        const movieUpdateFields = {
            ...movieRest,
            ...(newDirector && { director: newDirector }),
        };

        // newDirector가 존재하면 객체 형식으로 들어감
        // {
        //     ...movieRest,
        //     director: director(엔티티)
        // }

        await this.movieRepository.update({ id }, movieUpdateFields);

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
            relations: ['detail', 'director'],
        });

        newMoive.genres = newGenres; // 장르를 대입

        await this.movieRepository.save(newMoive); // 대입된 영화를 저장

        return this.movieRepository.findOne({
            where: {
                id,
            },
            relations: ['detail', 'director', 'genres'],
        });
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
