export interface IDecryptService {
  decryptDeep<T = any>(value: T): Promise<T>;
}
