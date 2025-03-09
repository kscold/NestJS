import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, QueryRunner, Repository } from 'typeorm';

import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entity/director.entity';
import { Genre } from '../genre/entity/genre.entity';
import { GetMoviesDto } from './dto/get-movies.dto';
import { CommonService } from '../common/common.service';
import { join } from 'path';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
        @InjectRepository(MovieDetail)
        private readonly movieDetailRepository: Repository<MovieDetail>,
        private readonly commonService: CommonService,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(dto: GetMoviesDto) {
        // const { title, take, page } = dto;
        const { title } = dto;
        const qb = await this.movieRepository
            .createQueryBuilder('videos')
            .leftJoinAndSelect('videos.director', 'director')
            .leftJoinAndSelect('videos.genres', 'genres');

        if (title) {
            qb.where('videos.title LIKE :title', { title: `%${title}%` });
        }

        // if (take && page) {
        //     this.commonService.applyPagePaginationParmsToQb(qb, dto);
        // }

        const { nextCursor } = await this.commonService.applyCursorPaginationParamsToQb(qb, dto);

        const [data, count] = await qb.getManyAndCount();

        return { data, nextCursor, count };
    }

    async findOne(id: number) {
        const movie = await this.movieRepository
            .createQueryBuilder('videos')
            .leftJoinAndSelect('videos.detail', 'detail')
            .leftJoinAndSelect('videos.director', 'director')
            .leftJoinAndSelect('videos.genres', 'genres')
            .where('videos.id = :id', { id })
            .getOne();

        // const videos = await this.movieRepository.findOne({
        //     where: { id },
        //     relations: ['detail', 'director', 'genres'],
        // });

        if (!movie) {
            throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
        }

        return movie;
    }

    async create(createMovieDto: CreateMovieDto, movieFileName: string, qr: QueryRunner) {
        const director = await qr.manager.findOne(Director, {
            where: { id: createMovieDto.directorId },
        });

        if (!director) {
            throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
        }

        const genres = await qr.manager.find(Genre, {
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

        const movieDetail = await qr.manager
            .createQueryBuilder()
            .insert()
            .into(MovieDetail)
            .values({ detail: createMovieDto.detail })
            .execute();

        // throw new NotFoundException('일부로 에러');

        const movieDetailId = movieDetail.identifiers[0].id;

        const movieFolder = join('public', 'movie');

        const movie = await qr.manager
            .createQueryBuilder()
            .insert()
            .into(Movie)
            .values({
                title: createMovieDto.title,
                detail: {
                    id: movieDetailId,
                },
                director,
                movieFilePatch: join(movieFolder, movieFileName),
            })
            .execute();

        const movieId = movie.identifiers[0].id;

        await qr.manager
            .createQueryBuilder()
            .relation(Movie, 'genres')
            .of(movieId)
            .add(genres.map((genre) => genre.id));

        return await qr.manager.findOne(Movie, {
            where: {
                id: movieId,
            },
            relations: ['detail', 'director', 'genres'],
        });
    }

    async update(id: number, updateMovieDto: UpdateMovieDto) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            const movie: Movie = await qr.manager.findOne(Movie, {
                where: {
                    id,
                },
                relations: ['detail', 'genres'],
            });

            if (!movie) {
                throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
            }

            const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

            let newDirector;

            if (directorId) {
                const director = await qr.manager.findOne(Director, {
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
                const genres = await qr.manager.find(Genre, { where: { id: In(genreIds) } });

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

            await qr.manager
                .createQueryBuilder()
                .update(Movie)
                .set(movieUpdateFields)
                .where('id = :id', { id })
                .execute();

            // throw new NotFoundException('에러 일부로 던짐!');

            // newDirector가 존재하면 객체 형식으로 들어감
            // {
            //     ...movieRest,
            //     director: director(엔티티)
            // }

            // await this.movieRepository.update({ id }, movieUpdateFields);

            if (detail) {
                await qr.manager
                    .createQueryBuilder()
                    .update(MovieDetail)
                    .set({ detail })
                    .where('id = :id', { id: movie.detail.id })
                    .execute();

                // await this.movieDetailRepository.update(
                //     {
                //         id: videos.detail.id,
                //     },
                //     {
                //         detail,
                //     },
                // );
            }

            if (newGenres) {
                await qr.manager
                    .createQueryBuilder()
                    .relation(Movie, 'genres')
                    .of(id)
                    // 새로 추가하고 원래 존재하던 id들은 삭제
                    .addAndRemove(
                        newGenres.map((genre) => genre.id),
                        movie.genres.map((genre) => genre.id),
                    );
            }

            // const newMoive = await this.movieRepository.findOne({
            //     where: {
            //         id,
            //     },
            //     relations: ['detail', 'director'],
            // });
            //
            // newMoive.genres = newGenres; // 장르를 대입
            //
            // await this.movieRepository.save(newMoive); // 대입된 영화를 저장

            await qr.commitTransaction();

            return this.movieRepository.findOne({
                where: {
                    id,
                },
                relations: ['detail', 'director', 'genres'],
            });
        } catch (e) {
            await qr.rollbackTransaction();
            throw e;
        } finally {
            await qr.release();
        }
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

        await this.movieRepository.createQueryBuilder().delete().where('id = :id', { id }).execute();

        await this.movieRepository.delete(id);
        await this.movieDetailRepository.delete(movie.detail.id);

        return id;
    }
}
