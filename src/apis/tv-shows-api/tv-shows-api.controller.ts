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
import { TVShowsApiService } from './tv-shows-api.service';
import type { Response } from 'express';
import { AddTVShowDto, FetchTVShowsListDto } from './dto/tv-shows.dto';

@Controller('tv-shows')
export class TVShowsApiController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly tvShowsApiService: TVShowsApiService,
  ) {}

  @Get('list')
  async getAllTVShows(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    queryParams: FetchTVShowsListDto,
    @Res() response: Response,
  ) {
    this.logger.log('Fetching all TV shows with query params:', queryParams);
    const result = await this.tvShowsApiService.getAllTVShows(queryParams);
    if (!result || result.length === 0) {
      response.status(HttpStatus.NOT_FOUND);
      return response.send({
        status: 'error',
        message: 'No TV shows found',
      });
    }

    response.status(HttpStatus.OK);
    return response.send({
      status: 'success',
      data: result,
    });
  }

  @Post('create')
  async addTVShow(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    requestBody: AddTVShowDto,
    @Res() response: Response,
  ) {
    this.logger.log(
      'info',
      'Creating a new tv show record: ' + JSON.stringify(requestBody),
    );

    const result = await this.tvShowsApiService.createTVShow(requestBody);
    if (!result) {
      response.status(HttpStatus.BAD_REQUEST);
      return response.send({
        status: 'failed',
        message: 'Failed to create Tv Show',
      });
    }

    response.status(HttpStatus.OK);
    return response.send({
      status: 'success',
      data: result,
    });
  }
}
