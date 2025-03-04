import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

import { CommonModule } from '../common/common.module';

import { MovieController } from './movie.controller';

import { MovieService } from './movie.service';

import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entity/director.entity';
import { Genre } from '../genre/entity/genre.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, MovieDetail, Director, Genre]),
        CommonModule,
        MulterModule.register({
            storage: diskStorage({
                destination: join(process.cwd(), 'public', 'movie'),
            }),
        }),
    ],
    controllers: [MovieController],
    providers: [MovieService],
})
export class MovieModule {}
