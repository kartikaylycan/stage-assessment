import { Module } from '@nestjs/common';
import { MongoDbModule } from 'src/cores/mongoDb/mongoDb.module';
import { tvShowsMongoDbProvider } from './tv-shows-mongoDb.provider';
import { TVShowsMongoDbService } from './tv-shows-mongoDb.service';

@Module({
  imports: [MongoDbModule],
  providers: [...tvShowsMongoDbProvider, TVShowsMongoDbService],
  exports: [TVShowsMongoDbService],
})
export class TVShowsMongoDbModule {}
