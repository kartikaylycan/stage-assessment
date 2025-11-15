import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MoviesAdaptor } from 'src/modules/movies/movies.adaptor';
import { AddMovieDto, FetchMoviesDto } from './dto/movies.dto';

@Injectable()
export class MoviesApiService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly moviesAdaptorService: MoviesAdaptor,
  ) {}

  getMoviesList(queryParams: FetchMoviesDto) {
    this.logger.log('info', 'Inside MoviesApiService - getMoviesList');
    return this.moviesAdaptorService.getAllMovies(
      queryParams.page,
      queryParams.limit,
    );
  }

  async addMovie(requestBody: AddMovieDto) {
    this.logger.log('info', 'Inside MoviesApiService - createMovie');
    const movieExists = await this.moviesAdaptorService.searchMovieByTitle(
      requestBody.title,
    );
    if (movieExists) {
      this.logger.warn(`Movie with title ${requestBody.title} already exists`);
      return null;
    }
    return this.moviesAdaptorService.saveMovieDetails(requestBody);
  }
}
