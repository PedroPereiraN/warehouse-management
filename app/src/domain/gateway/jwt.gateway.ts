import { JwtPayload } from "jsonwebtoken";

export interface JwtService {
  sign(payload: Record<string, unknown>, expiresIn?: number): string;
  verify(token: string): string | JwtPayload;
}
