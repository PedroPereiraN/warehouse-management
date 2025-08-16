import { User } from "../../domain/entity/user.entity";
import { UserGateway } from "../../domain/gateway/user.gateway";
import { PrismaClient } from "../../generated/prisma/client";

export class UserRepositoryPrisma implements UserGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new UserRepositoryPrisma(prismaClient);
  }

  public async save(user: User): Promise<void> {
    const data = {
      id: user.values.id,
      email: user.values.email,
      name: user.values.name,
      phone: user.values.phone,
      cpf: user.values.cpf,
      password: user.getPassword(),
      createdAt: user.values.createdAt,
      updatedAt: user.values.updatedAt,
      isAdmin: user.values.isAdmin,
    };

    await this.prismaClient.user.create({ data });
  }
}
