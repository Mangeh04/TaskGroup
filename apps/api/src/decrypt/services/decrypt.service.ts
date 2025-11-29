import { Injectable, Inject } from '@nestjs/common';

import { SERVICES } from 'src/utils/constants';
import type { ICryptoService } from 'src/crypto/interfaces/crypto.interface';
import { IDecryptService } from '../interfaces/decrypt.interface';

@Injectable()
export class DecryptService implements IDecryptService {
  constructor(
    @Inject(SERVICES.CRYPTO)
    private readonly cryptoService: ICryptoService,
  ) {}

  async decryptDeep(value: any): Promise<any> {
    if (value == null) return value;
    if (value instanceof Date) return value;

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
      if (key.endsWith('Iv')) continue;

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
