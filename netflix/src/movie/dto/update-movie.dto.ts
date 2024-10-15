import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMovieDto {
    @IsNotEmpty() // 값이 있는 경우에만 수정가능
    @IsOptional()
    title?: string;

    @IsNotEmpty()
    @IsOptional()
    genre?: string;
}
