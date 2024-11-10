import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDirectorDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsDateString()
    dob: string;

    @IsNotEmpty()
    nationality: string;
}
