import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { UsersListAdaptor } from 'src/modules/users-list/users-list.adaptor';
import {
  AddContentToUserList,
  FetchUsersListDto,
  RemoveContentFromUserListDto,
} from './dto/users-list.dto';

@Injectable()
export class UsersListApiService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private usersListAdaptorService: UsersListAdaptor,
  ) {}

  getAllUsersList(queryParams: FetchUsersListDto) {
    const { page, limit } = queryParams;
    return this.usersListAdaptorService.getAllUsersList(page, limit);
  }

  async addContentToUserList(requestBody: AddContentToUserList) {
    const { userId, contentId, category } = requestBody;
    try {
      const result =
        await this.usersListAdaptorService.searchAndAddConentInUserList(
          category,
          userId,
          contentId,
        );

      if (
        result.matchedCount === 0 &&
        result.upsertedCount === 0 &&
        !result.upsertedId
      ) {
        throw new BadRequestException(
          `Content already exists in the user's ${category}`,
        );
      } else {
        return this.usersListAdaptorService.searchUserListByUserId(userId);
      }
    } catch (err) {
      if (err && err.code === 11000) {
        throw new BadRequestException(
          `Content already exists in the user's ${category}`,
        );
      }
      throw err;
    }
  }

  async removeContentFromUserList(queryParams: RemoveContentFromUserListDto) {
    const { userId, contentId, category } = queryParams;
    try {
      const existingUserList =
        await this.usersListAdaptorService.searchUserListByUserId(userId);
      if (!existingUserList) {
        throw new BadRequestException(
          'Users list not found for provided userId',
        );
      }

      const updateResult =
        await this.usersListAdaptorService.removeContentFromUserList(
          userId,
          contentId,
          category,
        );

      if (!updateResult) {
        throw new BadRequestException(
          `Content not found in user's ${category}`,
        );
      }
    } catch (err) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
