import { Injectable } from '@nestjs/common';
import { UsersMongoDbService } from './schema/users-mongoDb.service';
import { User } from './models/users.interface';
import { UserPreferencesDto } from 'src/apis/users-api/dto/users.dto';

@Injectable()
export class UsersAdaptor {
  constructor(private readonly usersMongoDbService: UsersMongoDbService) {}

  async getAllActiveUsers(page: number, limit: number, fetchInactive = false) {
    const usersData = await this.usersMongoDbService.fetchAllUsers(
      page,
      limit,
      fetchInactive,
    );
    return (usersData ?? []).map((user) => {
      return {
        id: user.id,
        username: user.username,
        preferences: user.preferences,
        watchHistory: user.watchHistory,
        status: user.status ? 'Active' : 'Inactive',
      };
    });
  }

  async saveUserDetails(preferences: UserPreferencesDto, username: string) {
    const userPreference = {
      favoriteGenres: preferences?.favoriteGenres || [],
      dislikedGenres: preferences?.dislikedGenres || [],
    };

    const userData: Partial<User> = {
      username,
      preferences: userPreference,
      watchHistory: [],
      status: 1,
    };
    const createdUser =
      await this.usersMongoDbService.createAUserRecord(userData);
    return {
      id: createdUser.id,
      username: createdUser.username,
      preferences: createdUser.preferences,
      watchHistory: createdUser.watchHistory,
      status: createdUser.status ? 'Active' : 'Inactive',
    };
  }

  searchUsersByUsername(username: string): Promise<User | null> {
    return this.usersMongoDbService.searchUsersByUsername(username);
  }
}
