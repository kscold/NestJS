import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { CommonModule } from '../common/common.module';

import { MovieController } from './movie.controller';

import { MovieService } from './movie.service';

import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entity/director.entity';
import { Genre } from '../genre/entity/genre.entity';
import { MovieUserLike } from './entity/movie-user-like.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie, MovieDetail, MovieUserLike, Director, Genre, User]),
        CommonModule,
        CacheModule.register({ ttl: 0 }),
        // MulterModule.register({
        //     storage: diskStorage({
        //         destination: join(process.cwd(), 'public', 'movie'),
        //         filename(req, file, cb) {
        //             const split = file.originalname.split('.');
        //
        //             let extension = 'mp4';
        //
        //             if (split.length > 1) {
        //                 extension = split[split.length - 1];
        //             }
        //
        //             cb(null, `${v4()}_${Date.now()}.${extension}`);
        //         },
        //     }),
        // }),
    ],
    controllers: [MovieController],
    providers: [MovieService],
})
export class MovieModule {}
