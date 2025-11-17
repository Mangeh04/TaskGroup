export type Payload = {
  accessToken: string;
};

export interface IAuthService {
  signIn(email: string, password: string): Promise<Payload>;
  signUp(alias: string, email: string, password: string): Promise<Payload>;
}
