import {
  Injectable,
  CanActivate,
  ExecutionContext,
  OnModuleInit,
  Logger,
  Inject,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FirebaseAuthGuard implements CanActivate, OnModuleInit {
  private defaultApp: firebase.app.App | undefined;
  private logger = new Logger('HTTP');

  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // Initialize Firebase in onModuleInit
  async onModuleInit() {
    this.logger.verbose('Initializing firebase...');

    try {
      this.defaultApp = firebase.initializeApp({
        credential: firebase.credential.cert(
          JSON.parse(
            JSON.stringify(process.env.FIREBASE_PATH_SERVICE_ACCOUNT) || '',
          ),
        ),
      });

      this.logger.verbose('Firebase Initialized!');
    } catch (err) {
      this.logger.error('Error while initializing firebase!');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization;

    if (token && this.defaultApp) {
      try {
        const decodedToken = await this.defaultApp
          .auth()
          .verifyIdToken(token.replace('Bearer ', ''));

        if (!decodedToken.email) {
          this.logger.error('Email not found');
          return false;
        }

        const cachedUser = await this.cacheManager.get(decodedToken.email);

        if (cachedUser) {
          this.logger.verbose(
            'Token data found in cache. Skipping database query.',
          );

          req['user'] = cachedUser;
          return true;
        }

        // const user = await this.userModel.findOne({ email: payload.email }).exec();
        //
        // if (!user) {
        //   this.logger.error('A user does not exist ' + payload.email);
        //   return false;
        // }
        // const { password, ...result } = user.toObject();
        // this.logger.debug('loading user in cache...');
        // await this.cacheManager.set(payload.email, result);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    } else {
      return false;
    }
  }
}
