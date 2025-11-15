import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppConfigModule } from './configs/app/app-config.module';
import { UsersApiModule } from './apis/users-api/users-api.module';
import { MongoDbModule } from './cores/mongoDb/mongoDb.module';
import { MoviesApiModule } from './apis/movies-api/movies-api.module';
import { TVShowsApiModule } from './apis/tv-shows-api/tv-shows-api.module';
import { usersListApiModule } from './apis/users-list-api/users-list-api.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf((info) => {
              const { timestamp, level, message, ...rest } = info;
              return `${timestamp} [${level}]: ${message} ${Object.keys(rest).length ? JSON.stringify(rest) : ''}`;
            }),
          ),
        }),
      ],
    }),
    AppConfigModule,
    UsersApiModule,
    MoviesApiModule,
    TVShowsApiModule,
    usersListApiModule,
    MongoDbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
