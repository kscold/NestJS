import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';
import process from 'node:process';

import { Movie } from '../movie/entity/movie.entity';
import { DefaultLogger } from './logger/default.logger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class TasksService {
    // private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Movie)
        private readonly moiveRepository: Repository<Movie>,
        private readonly schedulerRegistry: SchedulerRegistry,
        // private readonly logger: DefaultLogger,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    @Cron('*/5 * * * * *')
    logEverySecond() {
        this.logger.fatal('FATAL 레벨 로그', null, TasksService.name);
        this.logger.error('ERROR 레벨 로그', null, TasksService.name);
        this.logger.warn('WARN 레벨 로그', TasksService.name);
        this.logger.log('LOG 레벨 로그', TasksService.name);
        this.logger.debug('DEBUG 레벨 로그', TasksService.name);
        this.logger.verbose('VERBOSE 레벨 로그', TasksService.name);
    }

    @Cron('* * * * * *')
    async eraseOrphanFiles() {
        const files = await readdir(join(process.cwd(), 'public', 'temp'));

        const deleteFilesTargets = files.filter((file) => {
            const filename = parse(file).name;

            const split = filename.split('_');

            if (split.length !== 2) {
                return true;
            }

            try {
                const date = +new Date(parseInt(split[split.length - 1]));
                const aDayInMilSec = 24 * 60 * 60 * 1000;

                const now = +new Date();

                // 생성한 시간이 하루가 지났는지 판단
                return now - date > aDayInMilSec;
            } catch (e) {
                return true;
            }
        });

        await Promise.all(deleteFilesTargets.map((x) => unlink(join(process.cwd(), 'public', 'temp', x))));
    }

    // @Cron('0 * * * * *')
    async calculateMovieLikeCounts() {
        console.log('run');
        await this.moiveRepository.query(
            `UPDATE movie m
             SET "likeCount" = (SELECT count(*)
                                FROM movie_user_like mul
                                WHERE m.id = mul."movieId"
                                  AND mul."isLike" = true)`,
        );

        await this.moiveRepository.query(
            `UPDATE movie m
             SET "disLikeCount" = (SELECT count(*)
                                   FROM movie_user_like mul
                                   WHERE m.id = mul."movieId"
                                     AND mul."isLike" = false)`,
        );
    }

    // @Cron('* * * * * *', {
    //     name: 'printer',
    // })
    printer() {
        console.log('print every senconds');
    }

    // @Cron('*/5 * * * * *')
    stopper() {
        console.log('---stopper run---');

        const job = this.schedulerRegistry.getCronJob('printer');

        // console.log('# Last Date');
        // console.log(job.lastDate());
        // console.log('# Next Date');
        // console.log(job.nextDate());
        console.log('# Next Date');
        console.log(job.nextDates(5));

        if (job.running) {
            job.stop();
        } else {
            job.stop();
        }
    }
}
