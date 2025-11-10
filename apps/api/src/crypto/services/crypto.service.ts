import { Injectable } from '@nestjs/common';
import type { User } from '@repo/database';

import { ICryptoService } from '../interfaces/crypto.interface';
import * as bcrypt from 'bcrypt';
import { createCipheriv, randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

type ExtendedUser = User & {
  emailIv: string;
  aliasIv: string;
};

@Injectable()
export class CryptoService implements ICryptoService {
  async hashUserData(data: User): Promise<User> {
    const { alias, email, password } = data;
    const [hashedPassword, [encryptedAlias, encryptedEmail]] =
      await Promise.all([
        this.hashPassword(password),
        this.encryptData(alias, email),
      ]);

    data.password = hashedPassword;
    data.email = encryptedEmail;
    data.alias = encryptedAlias;
    return data;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  private async encryptData(...data): Promise<Array<string>> {
    const iv = randomBytes(16);
    const password = 'test'; // Create the appconfig service to get the encryption password
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const textToEncrypt = 'Nest';
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    return [];
  }
}
