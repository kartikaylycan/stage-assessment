import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { addContentToUserListDto } from './dto/lists.dto';
import { UsersApiService } from './users-api.service';
import { AddUserDto, FetchUsersListDto } from './dto/users.dto';
import type { Response } from 'express';

@Controller('users')
export class UsersApiController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersApiService: UsersApiService,
  ) {}

  @Post('lists/add')
  addContentToUserList(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    )
    requestBody: addContentToUserListDto,
  ) {
    this.logger.log('info', 'Adding content to user list');
    this.usersApiService.addContentToUserList(requestBody);
    return { message: 'Content added to user list' };
  }

  @Post('create')
  async addUser(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    )
    requestBody: AddUserDto,
    @Res() response: Response,
  ) {
    this.logger.log(
      'info',
      'Creating a new user: ' + JSON.stringify(requestBody),
    );
    const result = await this.usersApiService.createUser(requestBody);
    if (!result) {
      response.status(HttpStatus.BAD_REQUEST);
      return response.send({
        status: 'failed',
        message: 'Failed to create user',
      });
    }

    response.status(HttpStatus.CREATED);
    return response.send({
      status: 'success',
      data: result,
    });
  }

  @Get('list')
  async getAllActiveUsers(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    )
    queryParams: FetchUsersListDto,
    @Res() response: Response,
  ) {
    this.logger.log(
      'info',
      'Fetching users list' + JSON.stringify(queryParams),
    );
    const result = await this.usersApiService.getAllActiveUsers(queryParams);

    if (result.length === 0) {
      response.status(HttpStatus.NOT_FOUND);
      return response.send({
        status: 'error',
        message: 'No users found',
      });
    }

    response.status(HttpStatus.OK);
    return response.send({
      status: 'success',
      data: result,
    });
  }
}
