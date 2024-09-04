import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';
import { FirebaseAuthGuard } from './common/guards/firebase.auth.guard';

async function bootstrap() {
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: function (origin, callback) {
        if (
          !origin ||
          (allowedOrigins && allowedOrigins.indexOf(origin) !== -1)
        ) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  });

  // Register Helmet for security
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      referrerPolicy: {
        policy: 'no-referrer',
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new FirebaseAuthGuard(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Learnix Swagger')
    .setDescription('All APIs descriptions')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'Enter bearer token',
      },
      'bearerAuth',
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/api', app, document);

  await app.listen(process.env.APP_PORT || 8085);
}
bootstrap();
