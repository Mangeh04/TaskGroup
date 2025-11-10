import { Injectable } from '@nestjs/common';

import {
  type EncryptedField,
  ICryptoService,
} from '../interfaces/crypto.interface';
import * as bcrypt from 'bcrypt';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'node:util';

const saltRounds = 10;

@Injectable()
export class CryptoService implements ICryptoService {
  constructor(private readonly configService: ConfigService) {}

  public async encrypt(data: string): Promise<EncryptedField> {
    const password = this.configService.get('ENCRYPT_SECRET') as string;

    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;

    const cipherAlias = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([
      cipherAlias.update(data),
      cipherAlias.final(),
    ]);

    return {
      ciphertext: encryptedText.toString('hex'),
      iv: iv.toString('hex'),
    };
  }

  public async decrypt(data: EncryptedField): Promise<string> {
    const password = this.configService.get('ENCRYPT_SECRET') as string;

    const iv = Buffer.from(data.iv, 'hex');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(data.ciphertext, 'hex')),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
}
