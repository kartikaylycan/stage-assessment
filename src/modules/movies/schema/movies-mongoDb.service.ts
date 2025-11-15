import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Movie } from '../models/moves.interface';

@Injectable()
export class MoviesMongoDbService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject('MOVIES_MONGODB_MODEL')
    private readonly moviesModel: Model<Movie>,
  ) {}

  fetchAllMovies(page: number = 1, limit: number = 100): Promise<Movie[]> {
    const skipToUse = page <= 1 ? 0 : (page - 1) * limit;
    return this.moviesModel.find().skip(skipToUse).limit(limit).exec();
  }

  createAMovieRecord(movieData: Partial<Movie>): Promise<Movie> {
    return this.moviesModel.create(movieData);
  }

  fetchMovieByTitle(title: string): Promise<Movie | null> {
    return this.moviesModel.findOne({ title }).exec();
  }
}
