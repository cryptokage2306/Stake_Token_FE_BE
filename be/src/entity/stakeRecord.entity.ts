import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class StakeRecord {
  @Column()
  blockNumber: number;

  @Column()
  from: string;

  @Column()
  amount: string;

  @PrimaryColumn()
  transactionHash: string;
}
