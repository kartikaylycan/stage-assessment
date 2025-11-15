import { Module } from '@nestjs/common';
import { UsersMongoDbModule } from './schema/users-mongoDb.module';
import { UsersAdaptor } from './users.adaptor';

@Module({
  imports: [UsersMongoDbModule],
  providers: [UsersAdaptor],
  exports: [UsersAdaptor],
})
export class UsersModule {}
