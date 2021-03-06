import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StakeRecord } from 'src/entity/stakeRecord.entity';
import { StakeRecordService } from './stakeRecord.service';

@Controller('stakeRecord')
export class StakeRecordController {
  constructor(private readonly stakeRecordService: StakeRecordService) {}

  @Get()
  getHello(): string {
    return this.stakeRecordService.getHello();
  }

  @Get('/records')
  getRecords(
    @Query() { skip, limit }: { skip?: number; limit?: number },
  ): Observable<StakeRecord[]> {
    return this.stakeRecordService.getRecords({
      limit,
      skip,
    });
  }
}
