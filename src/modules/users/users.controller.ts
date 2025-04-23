import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { API_ROUTES } from '../../config';
import { config } from '../../config/configuration';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from '../../commons/response';

@Controller({
  path: API_ROUTES.USERS,
  version: config().apiVersion,
})
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully created.',
    type: ResponseDto<CreateUserDto>,
  })
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating a new user');
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The users have been successfully retrieved.',
    type: ResponseDto<CreateUserDto[]>,
  })
  findAll() {
    this.logger.log('Retrieving all users');
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully retrieved.',
    type: ResponseDto<CreateUserDto>,
  })
  findOne(@Param('id') id: string) {
    this.logger.log(`Retrieving user with id: ${id}`);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
    type: ResponseDto<CreateUserDto>,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id: ${id}`);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully removed.',
    type: ResponseDto<boolean>,
  })
  remove(@Param('id') id: string) {
    this.logger.log(`Deleting user with id: ${id}`);
    return this.usersService.remove(+id);
  }
}
