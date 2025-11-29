import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { SKIP_DECRYPT_KEY } from '../decorators/skip-deccrypt.decorator';
import type { IDecryptService } from 'src/decrypt/interfaces/decrypt.interface';
import { SERVICES } from 'src/utils/constants';

@Injectable()
export class DecryptResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SERVICES.DECRYPT)
    private readonly decryptHelper: IDecryptService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType<'http' | 'ws' | 'rpc'>();

    if (type !== 'http') {
      return next.handle();
    }

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_DECRYPT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(mergeMap((data) => this.decryptHelper.decryptDeep(data)));
  }
}
