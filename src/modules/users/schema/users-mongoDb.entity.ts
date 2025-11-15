import * as mongoose from 'mongoose';

export const UsersMongoDbEntity = new mongoose.Schema(
  {
    username: { type: String, required: true },
    preferences: {
      favoriteGenres: { type: [String], required: true },
      dislikedGenres: { type: [String], required: true },
    },
    watchHistory: [
      {
        contentId: { type: String, required: true },
        watchedOn: { type: Date, required: true },
        rating: { type: Number, required: false },
      },
    ],
    status: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UsersMongoDbEntity.index({ username: 1 }, { unique: true });
