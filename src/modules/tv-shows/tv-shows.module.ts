import { Module } from '@nestjs/common';
import { TVShowsMongoDbModule } from './schema/tv-shows-mongoDb.module';
import { TVShowsAdaptor } from './tv-shows.adaptor';

@Module({
  imports: [TVShowsMongoDbModule],
  providers: [TVShowsAdaptor],
  exports: [TVShowsAdaptor],
})
export class TVShowsModule {}
