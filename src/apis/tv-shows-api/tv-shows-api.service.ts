import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { TVShowsAdaptor } from 'src/modules/tv-shows/tv-shows.adaptor';
import { AddTVShowDto, FetchTVShowsListDto } from './dto/tv-shows.dto';

@Injectable()
export class TVShowsApiService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly tvShowsAdaptorService: TVShowsAdaptor,
  ) {}

  getAllTVShows(queryParams: FetchTVShowsListDto) {
    this.logger.log('Fetching all TV shows with query params:', queryParams);
    return this.tvShowsAdaptorService.fetchAllTVShows(
      queryParams.page,
      queryParams.limit,
    );
  }

  async createTVShow(requestBody: AddTVShowDto) {
    const existingTVShow = await this.tvShowsAdaptorService.searchTVShowByTitle(
      requestBody.title,
    );
    if (existingTVShow) {
      this.logger.warn(
        `TV Show with title ${requestBody.title} already exists`,
      );
      return null;
    }

    return this.tvShowsAdaptorService.saveTVShowdetails(requestBody);
  }
}
