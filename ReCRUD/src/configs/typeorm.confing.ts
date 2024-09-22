import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import dotenv from 'dotenv';
import process from "node:process";

dotenv.config(); // .env 파일을 로드

export const typeORMConfing: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.HOSTNAME,
    port: parseInt(process.env.PORT, 10), // 문자열을 숫자로 변환
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};
