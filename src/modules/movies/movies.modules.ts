import { Module } from '@nestjs/common';
import { MoviesMongoDbModule } from './schema/movies-mongoDb.modules';
import { MoviesAdaptor } from './movies.adaptor';

@Module({
  imports: [MoviesMongoDbModule],
  providers: [MoviesAdaptor],
  exports: [MoviesAdaptor],
})
export class MoviesModule {}
