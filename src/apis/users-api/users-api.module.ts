import { Module } from '@nestjs/common';
import { UsersApiController } from './users-api.controller';
import { UsersApiService } from './users-api.service';
import { UsersModule } from 'src/modules/users/users.modules';

@Module({
  imports: [UsersModule],
  controllers: [UsersApiController],
  providers: [UsersApiService],
})
export class UsersApiModule {}
