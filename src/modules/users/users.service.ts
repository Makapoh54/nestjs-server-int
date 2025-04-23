import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    readonly repository: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.repository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.repository.findOneBy({
      _id: new ObjectId(id),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.repository.findOneAndUpdate(
      { where: { _id: new ObjectId(id) } },
      updateUserDto,
      {
        returnDocument: 'after',
      },
    ) as Promise<User | null>;
  }

  async remove(id: number): Promise<boolean> {
    const delResult = await this.repository.delete(id);
    return !!delResult.affected;
  }
}
