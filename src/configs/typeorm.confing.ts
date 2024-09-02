import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfing: TypeOrmModuleOptions = {
    // Database Type
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'board-app',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};
