import { Module } from '@nestjs/common';
import { TVShowsModule } from 'src/modules/tv-shows/tv-shows.module';
import { TVShowsApiController } from './tv-shows-api.controller';
import { TVShowsApiService } from './tv-shows-api.service';

@Module({
  imports: [TVShowsModule],
  controllers: [TVShowsApiController],
  providers: [TVShowsApiService],
})
export class TVShowsApiModule {}
