import { User } from "../entity/user.entity";

export interface UserGateway {
  save(user: User): Promise<void>;
}
