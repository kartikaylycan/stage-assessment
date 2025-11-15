import mongoose from 'mongoose';
import { MoviesMongoDbEntity } from './movies-mongoDb.entity';

export const moviesMongoDbProvider = [
  {
    provide: 'MOVIES_MONGODB_MODEL',
    useFactory: (connection: mongoose.Connection) => {
      return connection.model('Movies', MoviesMongoDbEntity);
    },
    inject: ['MONGODB_CONNECTION'],
  },
];
