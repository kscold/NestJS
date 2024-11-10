import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateDirectorDto {
    @IsNotEmpty()
    name?: string;

    @IsNotEmpty()
    @IsDateString()
    dob?: string;

    @IsNotEmpty()
    nationality?: string;
}
