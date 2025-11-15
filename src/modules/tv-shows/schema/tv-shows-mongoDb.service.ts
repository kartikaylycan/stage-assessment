import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Model } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TVShow } from '../models/tv-shows.interface';

@Injectable()
export class TVShowsMongoDbService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject('TV_SHOWS_MONGODB_MODEL')
    private readonly tvShowsModel: Model<TVShow>,
  ) {}

  fetchAllTVShows(page: number = 1, limit: number = 100): Promise<TVShow[]> {
    const skipToUse = page <= 1 ? 0 : (page - 1) * limit;
    return this.tvShowsModel.find().skip(skipToUse).limit(limit).exec();
  }

  createATVShowRecord(tvShowData: Partial<TVShow>): Promise<TVShow> {
    return this.tvShowsModel.create(tvShowData);
  }

  fetchTVShowByTitle(title: string): Promise<TVShow | null> {
    return this.tvShowsModel.findOne({ title }).exec();
  }
}
