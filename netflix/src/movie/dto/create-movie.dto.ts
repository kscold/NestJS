import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '영화 제목',
        example: '겨울왕국',
    })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '영화 설명',
        example: '3시간 훅감',
    })
    detail: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: '감독 객체 ID',
        example: 1,
    })
    directorId: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    @ApiProperty({
        description: '감독 객체 ID',
        example: [1, 2, 3],
    })
    genreIds: number[];

    @IsString()
    @ApiProperty({
        description: '영화 파일 이름',
        example: 'aaa-bbb-ccc.jpg',
    })
    movieFileName: string;
}
