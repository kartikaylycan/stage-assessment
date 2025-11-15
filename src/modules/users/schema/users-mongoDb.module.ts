import { Module } from '@nestjs/common';
import { usersMongodbProvider } from './users-mongoDb.provider';
import { MongoDbModule } from 'src/cores/mongoDb/mongoDb.module';
import { UsersMongoDbService } from './users-mongoDb.service';

@Module({
  imports: [MongoDbModule],
  providers: [...usersMongodbProvider, UsersMongoDbService],
  exports: [UsersMongoDbService],
})
export class UsersMongoDbModule {}
