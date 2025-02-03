import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

import { PagePaginationDto } from './dto/page-pagination.dto';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';
import { raw } from 'express';

@Injectable()
export class CommonService {
    constructor() {}

    applyPagePaginationParmsToQb<T>(qb: SelectQueryBuilder<T>, dto: PagePaginationDto) {
        const { take, page } = dto;

        const skip = (page - 1) * take;

        qb.take(take);
        qb.skip(skip);
    }

    async applyCursorPaginationParmsToQb<T>(qb: SelectQueryBuilder<T>, dto: CursorPaginationDto) {
        const { cursor, order, take } = dto;

        if (cursor) {
        }

        // [id_DESC, likeCount_DESC]
        for (let i = 0; i < order.length; i++) {
            const [column, direction] = order[i].split('_');

            if (direction !== 'ASC' && direction !== 'DESC') {
                throw new BadRequestException('Order는 ASC 또는 DESC으로 입력해주세요!');
            }

            if (i === 0) {
                qb.orderBy(`${qb.alias}.${column}`, direction);
            } else {
                qb.addOrderBy(`${qb.alias}.${column}`, direction);
            }
        }

        qb.take(take);

        const results = await qb.getMany();

        const nextCursor = this.generateNextCursor(results, order);

        return { qb, nextCursor };
    }

    generateNextCursor<T>(result: T[], order: string[]): string | null {
        if (result.length === 0) return null;

        // {
        //     value: {
        //         id: 27
        //     },
        //     order:['id_DESC']
        // }

        const lastTime = result[result.length - 1];

        const values = {};

        order.forEach((columnOrder) => {
            const [column] = columnOrder.split('_');
            values[column] = lastTime[column];
        });

        const cursorObj = { values, order };
        const nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64');

        return nextCursor;
    }
}
