import mongoose from 'mongoose';
import { UsersListMongoDbEntity } from './users-list-mongoDb.entity';

export const usersListMongoDbProvider = [
  {
    provide: 'USERS_LIST_MONGODB_MODEL',
    useFactory: (connection: mongoose.Connection) =>
      connection.model('users_list', UsersListMongoDbEntity),
    inject: ['MONGODB_CONNECTION'],
  },
];
