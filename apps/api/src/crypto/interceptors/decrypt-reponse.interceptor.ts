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

    return next.handle().pipe(mergeMap((data) => this.handleData(data)));
  }

  private async handleData(data: any): Promise<any> {
    if (data == null) return data;

    if (Array.isArray(data)) {
      return Promise.all(data.map((item) => this.decryptFlatObject(item)));
    }

    if (typeof data === 'object') {
      return this.decryptFlatObject(data);
    }

    return data;
  }

  private async decryptFlatObject(obj: any): Promise<any> {
    if (!obj || typeof obj !== 'object') return obj;

    const result: any = { ...obj };

    for (const [key, value] of Object.entries(result)) {
      if (!key.endsWith('Iv')) continue;

      const baseKey = key.slice(0, -2); // "nameIv" -> "name"

      delete result[key];

      if (!value) continue;
      if (!(baseKey in result)) continue;
      if (result[baseKey] == null) continue;

      try {
        result[baseKey] = await this.cryptoService.decrypt({
          ciphertext: String(result[baseKey]),
          iv: String(value),
        });
      } catch {}
    }

    return result;
  }
}
