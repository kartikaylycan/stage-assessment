import mongoose from 'mongoose';
import { TvShowsMongoDbEntity } from './tv-shows-mongoDb.entity';

export const tvShowsMongoDbProvider = [
  {
    provide: 'TV_SHOWS_MONGODB_MODEL',
    useFactory: (connection: mongoose.Connection) => {
      return connection.model('tv_shows', TvShowsMongoDbEntity);
    },
    inject: ['MONGODB_CONNECTION'],
  },
];
