import jwt from "jsonwebtoken";
import { JwtService } from "../domain/gateway/jwt.gateway";

export class JsonwebtokenService implements JwtService {
  private constructor(private readonly secret: string) {}

  public static create(secret: string) {
    return new JsonwebtokenService(secret);
  }

  sign(payload: Record<string, unknown>, expiresIn: number): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token: string) {
    const verify = jwt.verify(token, this.secret);

    return verify;
  }
}
