import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
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
        const movie = this.movieRepository.findOne({ where: { id } });

        if (!movie) {
            throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
        }

        return movie;
    }

    async createMovie(createMovieDto: CreateMovieDto) {
        const movie: Movie = await this.movieRepository.save({
            ...createMovieDto,
            runtime: 100,
        });

        return movie;
    }

    async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
        const movie = this.movieRepository.findOne({
            where: {
                id,
            },
        });

        if (!movie) {
            throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
        }

        await this.movieRepository.update({ id }, updateMovieDto);

        return movie;
    }

    deleteMovie(id: number) {}
}
