import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

import { PagePaginationDto } from './dto/page-pagination.dto';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';

@Injectable()
export class CommonService {
    constructor() {}

    applyPagePaginationParamsToQb<T>(qb: SelectQueryBuilder<T>, dto: PagePaginationDto) {
        const { take, page } = dto;

        const skip = (page - 1) * take;

        qb.take(take);
        qb.skip(skip);
    }

    async applyCursorPaginationParamsToQb<T>(qb: SelectQueryBuilder<T>, dto: CursorPaginationDto) {
        let { cursor, order, take } = dto;

        if (cursor) {
            const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');

            // {
            //     value: {
            //         id: 27
            //     },
            //     order:['id_DESC']
            // }

            const cursorObj = JSON.parse(decodedCursor);

            order = cursorObj.order;

            const { values } = cursorObj;

            // WHERE (colum1 > value1)
            // OR (colum1 = value1 AND colum2 < value2)
            // OR (colum1 = value1 AND colum2 = value2 AND colum3 > value3)
            // (videos.column1, videos.column2, videos.column3) > (:value1, :value2, :value3)

            const columns = Object.keys(values);
            const comparisonOperator = order.some((o) => o.endsWith('DESC')) ? '<' : '>';
            const whereConditions = columns.map((c) => `${qb.alias}.${c}`).join(',');
            const whereParams = columns.map((c) => `:${c}`).join(',');

            qb.where(`(${whereConditions}) ${comparisonOperator} (${whereParams})`, values);
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
