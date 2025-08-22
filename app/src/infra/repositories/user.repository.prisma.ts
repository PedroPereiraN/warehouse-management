import { User } from "../../domain/entity/user.entity";
import { UserGateway } from "../../domain/gateway/user.gateway";
import { PrismaClient } from "../../generated/prisma/client";
import { Logger } from "../../lib/logger";

export class UserRepositoryPrisma implements UserGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new UserRepositoryPrisma(prismaClient);
  }

  public async save(user: User): Promise<void> {
    const data = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      isAdmin: user.isAdmin,
    };

    await this.prismaClient.user.create({ data });
  }

  public async createDefaultUser(): Promise<void> {
    const defaultUserId = "273dc08e-e633-495a-8d89-96d2d77a885e";

    const findDefaultUser = this.findById(defaultUserId);

    const data = {
      id: defaultUserId,
      email: "default@email.com",
      name: "default user",
      phone: "00000000000",
      password: "$2b$10$tDAxlL2UNXSaKQx1HIbco.9vuuOxlWo6HyaHisZRCeXWbgQsF2c3",
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deletedAt: null,
      isAdmin: true,
    };

    if (!findDefaultUser) {
      await this.prismaClient.user.create({ data });

      Logger.info(
        `Default user create successfuly. Email: ${data.email}, password: ${data.password}. Default user data: `,
        data,
      );
    } else {
      Logger.info(
        `Default user already exists. Email: ${data.email}, password: ${data.password}.\n Default user data: `,
        data,
      );
    }
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
