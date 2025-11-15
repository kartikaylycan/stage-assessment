import mongoose from 'mongoose';

export const MoviesMongoDbEntity = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: [String], required: true },
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  actors: { type: [String], required: true },
});

MoviesMongoDbEntity.index({ title: 1 }, { unique: true });
