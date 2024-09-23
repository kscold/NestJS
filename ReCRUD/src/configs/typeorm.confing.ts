import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfing: TypeOrmModuleOptions = {
    type: 'postgres',
    // host: process.env.HOSTNAME,
    // port: parseInt(process.env.PORT), // 문자열을 숫자로 변환
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    // database: process.env.DB_NAME,
    host: 'localhost',
    port: 5432, // 문자열을 숫자로 변환
    username: 'postgres',
    password: 'vnsxk1022!',
    database: 'crud',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    // dropSchema: true, // 기존 스키마를 삭제하고 다시 생성
};
