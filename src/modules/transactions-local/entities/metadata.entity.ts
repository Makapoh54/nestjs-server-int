import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { Collections } from '../../../config';
import { ObjectId } from 'mongodb';

@Entity(Collections.SyncMetadata)
export class SyncMetadata {
  @ObjectIdColumn({
    transformer: {
      from: (id: ObjectId) => id.toHexString(),
      to: (id: string) => new ObjectId(id),
    },
  })
  id: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  fetchedAt: Date;

  @Column()
  requestsMade: number;

  @Column()
  itemsPulled: number;

  @Index({ unique: true })
  @Column()
  type: string;
}
