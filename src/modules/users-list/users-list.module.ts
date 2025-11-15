import { Module } from '@nestjs/common';
import { UsersListMongoDbModule } from './schema/users-list-mongoDb.module';
import { UsersListAdaptor } from './users-list.adaptor';

@Module({
  imports: [UsersListMongoDbModule],
  providers: [UsersListAdaptor],
  exports: [UsersListAdaptor],
})
export class usersListModule {}
