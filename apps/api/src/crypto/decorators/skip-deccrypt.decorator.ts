import { SetMetadata } from '@nestjs/common';

export const SKIP_DECRYPT_KEY = 'skipDecrypt';
export const SkipDecrypt = () => SetMetadata(SKIP_DECRYPT_KEY, true);
