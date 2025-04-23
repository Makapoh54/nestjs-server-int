import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Assuming User is an entity defined in your application
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
