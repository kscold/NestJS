import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

import { PagePaginationDto } from './dto/page-pagination.dto';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';

@Injectable()
export class CommonService {
    constructor() {}

    applyPagePaginationParmsToQb<T>(qb: SelectQueryBuilder<T>, dto: PagePaginationDto) {
        const { take, page } = dto;

        const skip = (page - 1) * take;

        qb.take(take);
        qb.skip(skip);
    }

    applyCursorPaginationParmsToQb<T>(qb: SelectQueryBuilder<T>, dto: CursorPaginationDto) {
        const { id, order, take } = dto;

        if (id) {
            const direction = order === 'ASC' ? '>' : '<';

            // order -> ASC : moive.id > :id
            qb.where(`${qb.alias}.id ${direction} :id`, { id });
        }

        qb.orderBy(`${qb.alias}.id`, order);

        qb.take(take);
    }
}
