import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { UsersList } from '../model/users-list.interface';

@Injectable()
export class UsersListMongoDbService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject('USERS_LIST_MONGODB_MODEL')
    private readonly usersListModel: Model<UsersList>,
  ) {}

  fetchAllUserList(page: number = 1, limit: number = 100) {
    const skipToUse = page <= 1 ? 0 : (page - 1) * limit;
    return this.usersListModel.find().skip(skipToUse).limit(limit).exec();
  }

  fetchAndUpdateUserListByFilter(filter, update) {
    return this.usersListModel
      .updateOne(filter, update, { upsert: true })
      .exec();
  }

  fetchUserListByUserId(userId) {
    return this.usersListModel.findOne({ userId }).exec();
  }

  fetchUserListAndUpdate(filter, update) {
    return this.usersListModel
      .findOneAndUpdate(filter, update, { new: true })
      .lean()
      .exec();
  }
}
