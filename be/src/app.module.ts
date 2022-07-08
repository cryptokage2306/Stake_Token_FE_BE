import { Module } from '@nestjs/common';
import { StakeRecordModule } from './stakeRecord/stakeRecord.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE_NAME,
} from './constant';
import { StakeRecord } from './entity/stakeRecord.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    StakeRecordModule,
    TypeOrmModule.forRoot({
      type: DB_TYPE,
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE_NAME,
      entities: [StakeRecord],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
