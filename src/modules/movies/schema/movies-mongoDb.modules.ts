import { Module } from '@nestjs/common';
import { MongoDbModule } from 'src/cores/mongoDb/mongoDb.module';
import { moviesMongoDbProvider } from './movies-mongoDb.provider';
import { MoviesMongoDbService } from './movies-mongoDb.service';

@Module({
  imports: [MongoDbModule],
  providers: [...moviesMongoDbProvider, MoviesMongoDbService],
  exports: [MoviesMongoDbService],
})
export class MoviesMongoDbModule {}
