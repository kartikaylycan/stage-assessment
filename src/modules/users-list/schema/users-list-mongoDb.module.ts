import { Module } from '@nestjs/common';
import { usersListMongoDbProvider } from './users-list-mongoDb.provider';
import { MongoDbModule } from 'src/cores/mongoDb/mongoDb.module';
import { UsersListMongoDbService } from './users-list-mongoDb.service';

@Module({
  imports: [MongoDbModule],
  providers: [...usersListMongoDbProvider, UsersListMongoDbService],
  exports: [UsersListMongoDbService],
})
export class UsersListMongoDbModule {}
