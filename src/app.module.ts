import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfing } from './configs/typeorm.confing';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeORMConfing), // TypeORM 설정
        BoardsModule,
    ],
})
export class AppModule {}
