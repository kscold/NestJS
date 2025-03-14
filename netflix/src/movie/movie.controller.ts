import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
} from '@nestjs/common';
import { QueryRunner as QR } from 'typeorm';

import { Public } from '../auth/decorator/public.decorator';
import { RBAC } from '../auth/decorator/rbac.decorator';
import { UserId } from '../user/decorator/user-id.decorator';
import { QueryRunner } from '../common/decorator/query-runner.decorator';
import { CacheInterceptor } from '../common/interceptor/cache.interceptor';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';

import { MovieService } from './movie.service';

import { Role } from '../user/entities/user.entity';

import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor)
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    @Public()
    @UseInterceptors(CacheInterceptor)
    getMovies(@Query() dto: GetMoviesDto, @UserId() userId: number) {
        return this.movieService.findAll(dto, userId);
    }

    @Get(':id')
    @Public()
    getMovie(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.movieService.findOne(id);
    }

    @Post()
    @RBAC(Role.admin)
    @UseInterceptors(TransactionInterceptor)
    postMovie(@Body() body: CreateMovieDto, @QueryRunner() queryRunner: QR, @UserId() userId: number) {
        return this.movieService.create(body, userId, queryRunner);
    }

    @Patch(':id')
    @RBAC(Role.admin)
    patchMovie(@Param('id', ParseIntPipe) id: string, @Body() body: UpdateMovieDto) {
        return this.movieService.update(+id, body);
    }

    @Delete(':id')
    @RBAC(Role.admin)
    deleteMovie(@Param('id', ParseIntPipe) id: string) {
        return this.movieService.remove(+id);
    }

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
    @Post(':id/like')
    createMovieLike(@Param('id', ParseIntPipe) movieId: number, @UserId() userId: number) {
        return this.movieService.toggleMovieLike(movieId, userId, true);
    }

    @Post(':id/dislike')
    createMovieDislike(@Param('id', ParseIntPipe) movieId: number, @UserId() userId: number) {
        return this.movieService.toggleMovieLike(movieId, userId, false);
    }
}
