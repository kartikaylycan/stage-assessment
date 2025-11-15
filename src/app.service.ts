import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  getHello(): string {
    this.logger.log(
      'info',
      `Application is running at ${process.env.APP_PORT ?? 3000}`,
    );
    return 'Application is running!';
  }
}
