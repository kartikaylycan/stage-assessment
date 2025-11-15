import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { AddMovieDto, FetchMoviesDto } from './dto/movies.dto';
import { MoviesApiService } from './movies-api.service';
import type { Response } from 'express';

@Controller('movies')
export class MoviesApiController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly moviesApiService: MoviesApiService,
  ) {}

  @Get('list')
  async getMoviesList(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    )
    queryParams: FetchMoviesDto,
    @Res() response: Response,
  ) {
    this.logger.log('Fetching movies list' + JSON.stringify(queryParams));
    const result = await this.moviesApiService.getMoviesList(queryParams);
    if (!result || result.length === 0) {
      response
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'No movies found' });
      return;
    }

    response.status(HttpStatus.OK);
    return response.send({ status: 'success', data: result });
  }

  @Post('create')
  async addMovie(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
      }),
    )
    requestBody: AddMovieDto,
    @Res() response: Response,
  ) {
    this.logger.log(
      'info',
      'Creating a new movie record: ' + JSON.stringify(requestBody),
    );
    const result = await this.moviesApiService.addMovie(requestBody);
    if (!result) {
      response.status(HttpStatus.BAD_REQUEST);
      return response.send({ message: 'Failed to create movie record' });
    }
    response.status(HttpStatus.CREATED);
    return response.send({ status: 'success', data: result });
  }
}
