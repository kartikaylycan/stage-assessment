import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mongoDbProvider } from './mongoDb.provider';

@Module({
  imports: [ConfigModule],
  providers: [...mongoDbProvider],
  exports: [...mongoDbProvider],
})
export class MongoDbModule {}
