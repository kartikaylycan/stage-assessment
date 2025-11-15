import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { UsersListApiService } from './users-list-api.service';
import type { Response } from 'express';
import {
  AddContentToUserList,
  FetchUsersListDto,
  RemoveContentFromUserListDto,
} from './dto/users-list.dto';

@Controller('users-list')
export class UsersListController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersListApiService: UsersListApiService,
  ) {}

  @Get('list')
  async fetchAllUsersList(
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
    this.logger.log('Fetching users list' + JSON.stringify(queryParams));
    const result = await this.usersListApiService.getAllUsersList(queryParams);
    if (!result || result.length == 0) {
      response.status(HttpStatus.NOT_FOUND);
      return response.send({
        status: 'error',
        message: 'No users list found',
      });
    }

    response.status(HttpStatus.OK);
    return response.send({
      status: 'success',
      data: result,
    });
  }

  @Post('add')
  async addContentToUserList(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    )
    requestBody: AddContentToUserList,
    @Res() response: Response,
  ) {
    const result =
      await this.usersListApiService.addContentToUserList(requestBody);
    response.status(HttpStatus.ACCEPTED);
    return response.send({
      status: 'success',
      data: result,
    });
  }

  @Delete('remove')
  async removeContent(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    )
    queryParams: RemoveContentFromUserListDto,
    @Res() response: Response,
  ) {
    const result =
      await this.usersListApiService.removeContentFromUserList(queryParams);
    response.status(HttpStatus.OK);
    return response.send({
      status: 'success',
      data: result,
    });
  }
}
