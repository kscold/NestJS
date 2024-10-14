import { Exclude, Expose } from 'class-transformer';

export class Movie {
    id: number;
    title: string;

    // @Expose()
    @Exclude()
    genre: string;
}
