import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Request,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    BadRequestException,
    UploadedFile,
} from '@nestjs/common';

import { Public } from '../auth/decorator/public.decorator';
import { RBAC } from '../auth/decorator/rbac.decorator';
import { CacheInterceptor } from '../common/interceptor/cache.interceptor';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';

import { MovieService } from './movie.service';

import { Role } from '../user/entities/user.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieFilePipe } from './pipe/movie-file.pipe';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor)
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    @Public()
    @UseInterceptors(CacheInterceptor)
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
    @UseInterceptors(TransactionInterceptor)
    @UseInterceptors(
        FileInterceptor('movie', {
            limits: {
                fileSize: 20000000,
            },
            fileFilter(req, file, callback) {
                console.log(file);

                if (file.mimetype !== 'video/mp4') {
                    return callback(new BadRequestException('MP4 타입만 업로드 가능합니다!'), false);
                }

                return callback(null, true);
            },
        }),
    )
    postMovie(@Body() body: CreateMovieDto, @Request() req, @UploadedFile() movie: Express.Multer.File) {
        return this.movieService.create(body, movie.filename, req.queryRunner);
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
