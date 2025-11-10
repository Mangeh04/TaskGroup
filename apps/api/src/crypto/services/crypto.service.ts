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
  createHmac,
} from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'node:util';

const saltRounds = 10;

@Injectable()
export class CryptoService implements ICryptoService {
  private cachedKey?: Buffer;

  constructor(private readonly configService: ConfigService) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async getKey(): Promise<Buffer> {
    if (this.cachedKey) return this.cachedKey;
    const password = this.configService.get<string>('ENCRYPT_SECRET')!;
    this.cachedKey = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    return this.cachedKey;
  }

  public async encrypt(data: string): Promise<EncryptedField> {
    const key = await this.getKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedText = Buffer.concat([cipher.update(data), cipher.final()]);
    return {
      ciphertext: encryptedText.toString('hex'),
      iv: iv.toString('hex'),
    };
  }

  public async decrypt(data: EncryptedField): Promise<string> {
    const key = await this.getKey();
    const iv = Buffer.from(data.iv, 'hex');
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

  public blindIndexEmail(email: string): string {
    const pepper = this.configService.get<string>('EMAIL_BI_PEPPER')!;
    const normalized = this.normalizeEmail(email);
    return createHmac('sha256', pepper)
      .update(normalized, 'utf8')
      .digest('hex');
  }
}
