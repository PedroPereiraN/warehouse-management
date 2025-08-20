import bcrypt from "bcryptjs";
import { Logger } from "../lib/logger";
import { PasswordHasher } from "../domain/gateway/password-hasher.gateway";

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 10;

  private constructor() {}

  public static create() {
    return new BcryptPasswordHasher();
  }

  public async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.saltRounds);

    Logger.info("password hash: ", hash);
    return hash;
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);

    Logger.info(
      "Comparing provided password with stored hash. Result:",
      result,
    );

    return result;
  }
}
