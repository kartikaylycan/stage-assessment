import { Injectable } from '@nestjs/common';
import { UsersListMongoDbService } from './schema/users-list-mongoDb.service';
import mongoose, { Types } from 'mongoose';
import { UserContentCategory } from 'src/apis/users-list-api/util/enum';

@Injectable()
export class UsersListAdaptor {
  constructor(
    private readonly usersListMongoDbService: UsersListMongoDbService,
  ) {}

  async getAllUsersList(page: number, limit: number) {
    const usersList = await this.usersListMongoDbService.fetchAllUserList(
      page,
      limit,
    );
    return (usersList || []).map((userList) => {
      return {
        id: userList.id,
        userId: userList.userId,
        moviesList: (userList.moviesList || []).map((moveItem) => {
          return {
            movieId: moveItem.movieId,
            addedDated: moveItem.addedDate,
          };
        }),
        tvShowsList: (userList.tvShowsList || []).map((tvShowItem) => {
          return {
            movieId: tvShowItem.tvShowId,
            addedDated: tvShowItem.addedDate,
          };
        }),
      };
    });
  }

  searchUserListByUserId(userId: string) {
    const userIdMdb = new mongoose.Types.ObjectId(userId);
    return this.usersListMongoDbService.fetchUserListByUserId(userIdMdb);
  }

  async searchAndAddConentInUserList(
    category: string,
    userId: string,
    contentId: string,
  ) {
    const categoryList =
      category === UserContentCategory.TVSHOW ? 'tvShowsList' : 'moviesList';

    const idField = category === 'tv-show' ? 'tvShowId' : 'movieId';

    const userIdMdb = new mongoose.Types.ObjectId(userId);
    const conentIdMdb = new mongoose.Types.ObjectId(contentId);

    const filter = {
      userId: userIdMdb,
      [`${categoryList}.${idField}`]: { $ne: conentIdMdb },
    };

    const pushObj = {
      [idField]: conentIdMdb,
      addedDate: new Date(),
    };

    const update = {
      $setOnInsert: { userId: userIdMdb },
      $push: { [categoryList]: pushObj },
    };

    return this.usersListMongoDbService.fetchAndUpdateUserListByFilter(
      filter,
      update,
    );
  }

  async removeContentFromUserList(
    userId: string,
    contentId: string,
    category: string,
  ) {
    const categoryList =
      category === UserContentCategory.TVSHOW ? 'tvShowsList' : 'moviesList';
    const idField =
      category === UserContentCategory.TVSHOW ? 'tvShowId' : 'movieId';

    const userIdMdb = new mongoose.Types.ObjectId(userId);
    const conentIdMdb = new mongoose.Types.ObjectId(contentId);

    const filter = {
      userId: userIdMdb,
      [`${categoryList}.${idField}`]: conentIdMdb,
    };

    const update = {
      $pull: {
        [categoryList]: { [idField]: conentIdMdb },
      },
    };

    return this.usersListMongoDbService.fetchUserListAndUpdate(filter, update);
  }
}
