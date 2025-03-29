import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { readdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class TasksService {
    constructor() {}

    async eraseOrphanFiles() {
        const files = await readdir(join(process.cwd(), 'public', 'temp'));
        console.log(files);
    }

    @Cron('* * * * * *')
    logEverySecond() {
        console.log('1초마다 실행!');
    }
}
