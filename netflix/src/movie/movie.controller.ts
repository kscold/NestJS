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

import { Public } from '../auth/decorator/public.decorator';
import { RBAC } from '../auth/decorator/rbac.decorator';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';

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
    getMovies(@Query() dto: GetMoviesDto) {
        return this.movieService.findAll(dto);
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
    postMovie(@Body() body: CreateMovieDto) {
        return this.movieService.create(body);
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
}
