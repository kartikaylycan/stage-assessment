import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { User } from '../models/users.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Model } from 'mongoose';

@Injectable()
export class UsersMongoDbService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject('USERS_MONGODB_MODEL')
    private readonly usersModel: Model<User>,
  ) {}

  fetchAllUsers(
    page: number = 1,
    limit: number = 100,
    fetchInactive = false,
  ): Promise<User[]> {
    const skipToUse = page <= 1 ? 0 : (page - 1) * limit;
    return this.usersModel
      .find({
        status: fetchInactive ? 0 : 1,
      })
      .skip(skipToUse)
      .limit(limit)
      .exec();
  }

  createAUserRecord(userData: Partial<User>): Promise<User> {
    return this.usersModel.create(userData);
  }

  searchUsersByUsername(username: string): Promise<User | null> {
    return this.usersModel.findOne({ username }).exec();
  }
}
