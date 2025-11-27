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

import { SERVICES } from 'src/utils/constants';
import type { ICryptoService } from '../interfaces/crypto.interface';
import { SKIP_DECRYPT_KEY } from '../decorators/skip-deccrypt.decorator';

@Injectable()
export class DecryptResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SERVICES.CRYPTO) private readonly cryptoService: ICryptoService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_DECRYPT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) {
      return next.handle();
    }

    return next.handle().pipe(mergeMap((data) => this.decryptDeep(data)));
  }

  private async decryptDeep(value: any): Promise<any> {
    if (value == null) return value;

    if (value instanceof Date) {
      return value;
    }

    if (Array.isArray(value)) {
      return Promise.all(value.map((item) => this.decryptDeep(item)));
    }

    if (typeof value === 'object') {
      return this.decryptObject(value);
    }

    return value;
  }

  private async decryptObject(obj: any): Promise<any> {
    if (!obj || typeof obj !== 'object' || obj instanceof Date) return obj;

    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key.endsWith('Iv')) {
        continue;
      }

      const ivKey = `${key}Iv`;

      if (ivKey in obj) {
        const ciphertext = value;
        const iv = (obj as any)[ivKey];

        if (ciphertext != null && iv != null) {
          try {
            result[key] = await this.cryptoService.decrypt({
              ciphertext: String(ciphertext),
              iv: String(iv),
            });
          } catch {
            result[key] = ciphertext;
          }
        } else {
          result[key] = ciphertext;
        }

        continue;
      }

      result[key] = await this.decryptDeep(value);
    }

    return result;
  }
}
