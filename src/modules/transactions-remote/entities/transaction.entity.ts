import { Entity, Column, Index, ObjectIdColumn } from 'typeorm';
import { Collections, TransactionType } from '../../../config';
import { ObjectId } from 'mongodb';

@Entity(Collections.TransactionsRemote)
export class TransactionRemote {
  @ObjectIdColumn({
    transformer: {
      from: (id: ObjectId) => id.toHexString(),
      to: (id: string) => new ObjectId(id),
    },
  })
  id: string;

  @Column({ type: 'string' })
  uuid: string;

  @Index()
  @Column({ type: 'string' })
  userId: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column('double')
  amount: number;
}
