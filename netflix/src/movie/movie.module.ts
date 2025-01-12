import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';

import { MovieController } from './movie.controller';

import { MovieService } from './movie.service';

import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entity/director.entity';
import { Genre } from '../genre/entity/genre.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Movie, MovieDetail, Director, Genre]), CommonModule],
    controllers: [MovieController],
    providers: [MovieService],
})
export class MovieModule {}
