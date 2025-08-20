import bcrypt from "bcryptjs";
import { Logger } from "../lib/logger";

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

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
