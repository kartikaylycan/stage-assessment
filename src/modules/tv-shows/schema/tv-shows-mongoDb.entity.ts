import mongoose from 'mongoose';

export const TVShowsEpisodesSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  seasonNumber: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  actors: { type: [String], required: true },
});

export const TvShowsMongoDbEntity = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: [String], required: true },
  episodes: { type: [TVShowsEpisodesSchema], required: true },
});

TvShowsMongoDbEntity.index({ title: 1 }, { unique: true });
