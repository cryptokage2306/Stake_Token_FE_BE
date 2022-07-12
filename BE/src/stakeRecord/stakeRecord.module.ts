import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakeRecord } from 'src/entity/stakeRecord.entity';
import { StakeRecordController } from './stakeRecord.controller';
import { StakeRecordService } from './stakeRecord.service';

@Module({
  imports: [TypeOrmModule.forFeature([StakeRecord])],
  controllers: [StakeRecordController],
  providers: [StakeRecordService],
})
export class StakeRecordModule {}
