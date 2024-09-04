import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CompressionMiddleware } from '../../common/middlewares/compression.middleware';
import { AppLoggerMiddleware } from '../../common/middlewares/app.logger.middleware';
import { FirebaseAuthGuard } from '../../common/guards/firebase.auth.guard';
@Module({
  imports: [
    //For configurations
    ConfigModule.forRoot(),

    //Throttle requests
    ThrottlerModule.forRoot([
      {
        ttl: 5,
        limit: 60,
      },
    ]),

    //Caching Module
    CacheModule.register({
      ttl: 1800000, //30 minutes
    }),
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CompressionMiddleware, AppLoggerMiddleware).forRoutes('*'); // Apply middleware to all routes or specify the routes as needed
  }
}
