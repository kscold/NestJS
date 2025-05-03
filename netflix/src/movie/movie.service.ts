import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import process from 'node:process';
import { rename } from 'fs/promises';
import { join } from 'path';

import { CommonService } from '../common/common.service';

import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entity/director.entity';
import { Genre } from '../genre/entity/genre.entity';

import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { User } from '../user/entity/user.entity';
import { MovieUserLike } from './entity/movie-user-like.entity';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
        @InjectRepository(MovieDetail)
        private readonly movieDetailRepository: Repository<MovieDetail>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(MovieUserLike)
        private readonly movieUserLikeRepository: Repository<MovieUserLike>,

        private readonly commonService: CommonService,
        private readonly dataSource: DataSource,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    async findRecent() {
        const cacheData = await this.cacheManager.get('MOVIE_RECENT');

        // cacheData가 있으면 그대로 반환
        if (cacheData) {
            // console.log('cache 가져옴!');
            return cacheData;
        }

        const data = await this.movieRepository.find({
            order: {
                createdAt: 'DESC',
            },
            take: 10,
        });

        await this.cacheManager.set('MOVIE_RECENT', data);

        return data;
    }

    async findAll(dto: GetMoviesDto, userId?: number) {
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

        // eslint-disable-next-line prefer-const
        let [data, count] = await qb.getManyAndCount();

        if (userId) {
            const movieIds = data.map((movie) => movie.id);

            const likeMovies =
                movieIds.length < 1
                    ? []
                    : await this.movieUserLikeRepository
                          .createQueryBuilder('mul')
                          .leftJoinAndSelect('mul.user', 'user')
                          .leftJoinAndSelect('mul.movie', 'movie')
                          .where('movie.id IN (:...movieIds)', { movieIds })
                          .andWhere('user.id = :userId', { userId })
                          .getMany();

            /*
             * {
             *   movieId: boolean
             * }
             */
            const likedMovieMap = likeMovies.reduce(
                (acc, next) => ({
                    ...acc,
                    [next.movie.id]: next.isLike,
                }),
                {},
            );

            //  e.g. { 1: true, 3: false, 5: true }

            data = data.map((x) => ({
                ...x,
                // null || true || false
                likeStatus: x.id in likedMovieMap ? likedMovieMap[x.id] : null,
            }));
        }

        return { data, nextCursor, count };
    }

    async findOne(id: number) {
        const movie = await this.movieRepository
            .createQueryBuilder('moive')
            .leftJoinAndSelect('moive.detail', 'detail')
            .leftJoinAndSelect('moive.director', 'director')
            .leftJoinAndSelect('moive.genres', 'genres')
            .leftJoinAndSelect('moive.creator', 'creator')
            .where('moive.id = :id', { id })
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

    async create(createMovieDto: CreateMovieDto, userId: number, qr: QueryRunner) {
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
        const tempFolder = join('public', 'temp');

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
                creator: {
                    id: userId,
                },
                movieFilePatch: join(movieFolder, createMovieDto.movieFileName),
            })
            .execute();

        const movieId = movie.identifiers[0].id;

        await qr.manager
            .createQueryBuilder()
            .relation(Movie, 'genres')
            .of(movieId)
            .add(genres.map((genre) => genre.id));

        // 트렌젝션 이상 없으면 파일이 옮겨져야하므로 코드 위치를 아래로 내림
        await rename(
            join(process.cwd(), tempFolder, createMovieDto.movieFileName),
            join(process.cwd(), movieFolder, createMovieDto.movieFileName),
        );

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

    async toggleMovieLike(movieId: number, userId: number, isLike: boolean) {
        const movie = await this.movieRepository.findOne({
            where: {
                id: movieId,
            },
        });

        if (!movie) {
            throw new BadRequestException('존재하지 않는 영화입니다!');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new UnauthorizedException('사용자 정보가 없습니다!');
        }

        const likeRecord = await this.movieUserLikeRepository
            .createQueryBuilder('mul')
            .leftJoinAndSelect('mul.movie', 'movie')
            .leftJoinAndSelect('mul.user', 'user')
            .where('movie.id = :movieId', { movieId })
            .andWhere('user.id = :userId', { userId })
            .getOne();

        if (likeRecord) {
            if (isLike === likeRecord.isLike) {
                await this.movieUserLikeRepository.delete({
                    movie,
                    user,
                });
            } else {
                await this.movieUserLikeRepository.update(
                    {
                        movie,
                        user,
                    },
                    { isLike },
                );
            }
        } else {
            await this.movieUserLikeRepository.save({
                movie,
                user,
                isLike,
            });
        }

        const result = await this.movieUserLikeRepository
            .createQueryBuilder('mul')
            .leftJoinAndSelect('mul.movie', 'movie')
            .leftJoinAndSelect('mul.user', 'user')
            .where('movie.id = :movieId', { movieId })
            .andWhere('user.id = :userId', { userId })
            .getOne();

        return {
            isLike: result && result.isLike,
        };
    }
}
