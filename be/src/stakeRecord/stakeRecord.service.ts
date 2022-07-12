import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StakeRecord } from '../entity/stakeRecord.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { constants, Contract, providers } from 'ethers';
import { from as fromPromise } from 'rxjs';

@Injectable()
export class StakeRecordService {
  constructor(
    @InjectRepository(StakeRecord)
    private stakeRepository: Repository<StakeRecord>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  _createTask({
    amount,
    from,
    blockNumber,
    transactionHash,
  }: {
    amount: string;
    from: string;
    blockNumber: number;
    transactionHash: string;
  }) {
    const record = new StakeRecord();
    record.amount = `${amount}`;
    record.from = from;
    record.blockNumber = blockNumber;
    record.transactionHash = transactionHash;
    return fromPromise(this.stakeRepository.save(record));
  }

  getRecords({ skip, limit }: { skip?: number; limit?: number }) {
    return fromPromise(
      this.stakeRepository.find({
        skip,
        take: limit,
      }),
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    const abi = [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ];
    const web3Provider = new providers.InfuraProvider(
      4,
      '2a0466dbf35b4b1f8e210f257f4ffca2',
    );

    const contract = new Contract(
      '0x2fa337efDE18cDA62af20eD9ECBD4181CD41c1e3',
      abi,
      web3Provider,
    );
    contract.on('Transfer', (from, to, value, event) => {
      if (to === constants.AddressZero) {
        this._createTask({
          from,
          amount: value,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        });
      }
    });
  }
}
