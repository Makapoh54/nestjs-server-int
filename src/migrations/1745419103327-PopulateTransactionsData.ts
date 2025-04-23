import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';

export class PopulateTransactionsData1745419103327
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = Array.from({ length: 1000 }, () =>
      faker.string.alphanumeric(6),
    );

    const transactions = users.flatMap((userId) => {
      const earnedCount = faker.number.int({ min: 1, max: 10 });
      const spentCount = faker.number.int({ min: 1, max: 3 });
      const payoutCount = faker.number.int({ min: 1, max: 3 });

      const earned = Array.from({ length: earnedCount }, () => ({
        uuid: faker.string.uuid(),
        userId,
        createdAt: faker.date.recent({ days: 90 }),
        type: 'earned',
        amount: parseFloat(faker.finance.amount({ min: 1, max: 100, dec: 1 })),
      }));

      const spent = Array.from({ length: spentCount }, () => ({
        uuid: faker.string.uuid(),
        userId,
        createdAt: faker.date.recent({ days: 90 }),
        type: 'spent',
        amount: parseFloat(faker.finance.amount({ min: 1, max: 100, dec: 1 })),
      }));

      const payout = Array.from({ length: payoutCount }, () => ({
        uuid: faker.string.uuid(),
        userId,
        createdAt: faker.date.recent({ days: 90 }),
        type: 'payout',
        amount: parseFloat(faker.finance.amount({ min: 1, max: 100, dec: 1 })),
      }));

      return [...earned, ...spent, ...payout];
    });

    await queryRunner.manager
      .getMongoRepository('TransactionRemote')
      .insertMany(transactions);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getMongoRepository('TransactionRemote').deleteMany({});
  }
}
