import type { User } from "@repo/database";

export interface ICryptoService {
    hashUserData(data: User): Promise<User>;
}