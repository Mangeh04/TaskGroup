export type EncryptedField = {
  ciphertext: string; // hex
  iv: string; // hex
};

export interface ICryptoService {
  encrypt(data: string): Promise<EncryptedField>;
  decrypt(data: EncryptedField): Promise<string>;
  hash(password: string): Promise<string>;
}
