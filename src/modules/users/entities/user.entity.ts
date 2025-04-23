import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn({
    transformer: {
      from: (id: ObjectId) => id.toHexString(),
      to: (id: string) => new ObjectId(id),
    },
  })
  id: string;

  @Column({ type: 'string' })
  displayName: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
