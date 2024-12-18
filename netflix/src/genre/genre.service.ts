import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Genre } from './entity/genre.entity';

import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,
    ) {}
    async create(createGenreDto: CreateGenreDto) {
        return await this.genreRepository.save(createGenreDto);
    }

    async findAll() {
        return await this.genreRepository.find();
    }

    async findOne(id: number) {
        return await this.genreRepository.findOne({
            where: {
                id,
            },
        });
    }

    async update(id: number, updateGenreDto: UpdateGenreDto) {
        const genre = await this.genreRepository.findOne({ where: { id } });

        if (!genre) {
            throw new NotFoundException('존재하지 않는 장르입니다.');
        }

        await this.genreRepository.update(
            {
                id,
            },
            { ...updateGenreDto },
        );
        const newGenre = await this.genreRepository.findOne({
            where: { id },
        });

        return newGenre;
    }

    async remove(id: number) {
        const genre = await this.genreRepository.findOne({
            where: {
                id,
            },
        });

        if (!genre) {
            throw new NotFoundException('존재하지 않는 장르입니다.');
        }

        await this.genreRepository.delete(id);

        return id;
    }
}