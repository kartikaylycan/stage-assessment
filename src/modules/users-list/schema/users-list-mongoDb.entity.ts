import mongoose from 'mongoose';

export const UsersListMongoDbEntity = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  moviesList: {
    type: [
      {
        movieId: mongoose.Schema.Types.ObjectId,
        addedDate: { type: Date, required: true },
      },
    ],
    required: true,
  },
  tvShowsList: {
    type: [
      {
        tvShowId: mongoose.Schema.Types.ObjectId,
        addedDate: { type: Date, required: true },
      },
    ],
    required: true,
  },
});

UsersListMongoDbEntity.index({ userId: 1 }, { unique: true });
UsersListMongoDbEntity.index({ 'moviesList.movieId': 1 }, { unique: true });
UsersListMongoDbEntity.index({ 'tvShowsList.tvShowId': 1 }, { unique: true });
