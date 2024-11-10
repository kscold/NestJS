import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDirectorDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    dob?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    nationality?: string;
}
