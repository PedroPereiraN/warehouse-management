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

  public async findById(id: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
    });

    if (user) {
      const data = User.with({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        password: user.password,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString() ?? null,
        deletedAt: user.deletedAt?.toISOString() ?? null,
      });

      return data;
    }

    return null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { email },
    });

    if (user) {
      const data = User.with({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        password: user.password,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString() ?? null,
        deletedAt: user.deletedAt?.toISOString() ?? null,
      });

      return data;
    }

    return null;
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { cpf },
    });

    if (user) {
      const data = User.with({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        password: user.password,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString() ?? null,
        deletedAt: user.deletedAt?.toISOString() ?? null,
      });

      return data;
    }

    return null;
  }

  public async findByPhone(phone: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { phone },
    });

    if (user) {
      const data = User.with({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        password: user.password,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString() ?? null,
        deletedAt: user.deletedAt?.toISOString() ?? null,
      });

      return data;
    }

    return null;
  }
}
