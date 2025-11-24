export type Payload = {
  accessToken: string;
};

export interface IAuthService {
  signIn(email: string, password: string): Promise<Payload>;
  signUp(alias: string, email: string, password: string): Promise<Payload>;
  changePassword(
    id: string,
    oldPassword: string,
    newPassword1: string,
    newPassword2: string,
  ): Promise<boolean>;
}
