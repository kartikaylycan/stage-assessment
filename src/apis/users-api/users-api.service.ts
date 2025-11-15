import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { addContentToUserListDto } from './dto/lists.dto';
import { UsersAdaptor } from 'src/modules/users/users.adaptor';
import { AddUserDto, FetchUsersListDto } from './dto/users.dto';

@Injectable()
export class UsersApiService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersAdaptorService: UsersAdaptor,
  ) {}

  addContentToUserList(requestBody: addContentToUserListDto) {
    this.logger.log('info', 'Inside service method');
    this.logger.log('info', `Request Body: ${JSON.stringify(requestBody)}`);
  }

  getAllActiveUsers(queryParams: FetchUsersListDto) {
    const { page, limit, fetchInactive } = queryParams;
    return this.usersAdaptorService.getAllActiveUsers(
      page,
      limit,
      fetchInactive,
    );
  }

  async createUser(requestBody: AddUserDto) {
    const existingUser = await this.usersAdaptorService.searchUsersByUsername(
      requestBody.username,
    );
    if (existingUser) {
      this.logger.warn(
        `User with username ${requestBody.username} already exists`,
      );
      return null;
    }

    this.logger.log('Creating user with data: ', requestBody);
    return this.usersAdaptorService.saveUserDetails(
      requestBody.preferences,
      requestBody.username,
    );
  }
}
