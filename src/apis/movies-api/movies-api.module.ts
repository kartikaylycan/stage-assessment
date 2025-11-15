import { Module } from '@nestjs/common';
import { MoviesModule } from 'src/modules/movies/movies.modules';
import { MoviesApiController } from './movies-api.controller';
import { MoviesApiService } from './movies-api.service';

@Module({
  imports: [MoviesModule],
  controllers: [MoviesApiController],
  providers: [MoviesApiService],
})
export class MoviesApiModule {}
