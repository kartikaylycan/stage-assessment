import mongoose from 'mongoose';
import { UsersMongoDbEntity } from './users-mongoDb.entity';

export const usersMongodbProvider = [
  {
    provide: 'USERS_MONGODB_MODEL',
    useFactory: (connection: mongoose.Connection) =>
      connection.model('users', UsersMongoDbEntity),
    inject: ['MONGODB_CONNECTION'],
  },
];
