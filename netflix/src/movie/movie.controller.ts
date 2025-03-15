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
import { CacheInterceptor as CI, CacheKey, CacheTTL } from '@nestjs/cache-manager';

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

    // 선언위치가 중요 :id에 먼저 걸리지 않도록 설정해야함
    @Get('recent')
    @UseInterceptors(CI) // 엔드포인트 자체를 캐싱 엔드포린트가 key가, 따라서 쿼리/파라미터는 캐싱이 안됨
    @CacheKey('getMoviesRecent') // 쿼리/파라미터까지 캐싱
    @CacheTTL(1000)
    getMoviesRecent() {
        console.log('getMoviesRecent() 실행!');
        return this.movieService.findRecent();
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
