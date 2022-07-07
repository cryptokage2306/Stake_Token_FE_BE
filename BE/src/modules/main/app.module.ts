import { ConfigService } from './../config/config.service';
import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    // DatabaseModule, // TODO: need to check these things
    // TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule /* implements NestModule */ {
  static port: string | number;
  static isDev: boolean;

  constructor(private readonly config: ConfigService) {
    AppModule.port = config.get('API_PORT');
    AppModule.isDev = config.isDev;
  }

  // DOC: https://docs.nestjs.com/middleware
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(loggerMiddleware)
  //     .forRoutes({ path: '/', method: RequestMethod.ALL });
  // }
}
