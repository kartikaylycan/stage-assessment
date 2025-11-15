import { Module } from '@nestjs/common';
import { UsersListController } from './users-list-api.controller';
import { usersListModule } from 'src/modules/users-list/users-list.module';
import { UsersListApiService } from './users-list-api.service';

@Module({
  imports: [usersListModule],
  controllers: [UsersListController],
  providers: [UsersListApiService],
})
export class usersListApiModule {}
