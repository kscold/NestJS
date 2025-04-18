import { IsOptional, IsString } from 'class-validator';

import { PagePaginationDto } from '../../common/dto/page-pagination.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

// export class GetMoviesDto extends PagePaginationDto {
export class GetMoviesDto extends CursorPaginationDto {
    @IsString()
    @IsOptional()
    title?: string;
}
