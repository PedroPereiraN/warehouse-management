import { User } from "../../domain/entity/user.entity";
import { UserGateway } from "../../domain/gateway/user.gateway";
import {
  AuthenticateUserInputDto,
  AuthenticateUserOutputDto,
} from "../../dtos/user";
import { Usecase } from "../usecase";
import { PasswordHasher } from "../../domain/gateway/password-hasher.gateway";
import { JwtService } from "../../domain/gateway/jwt.gateway";

export class AuthenticateUserUsecase
  implements Usecase<AuthenticateUserInputDto, AuthenticateUserOutputDto>
{
  private constructor(
    private readonly userGateway: UserGateway,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  public static create(
    gateway: UserGateway,
    passwordHasher: PasswordHasher,
    jwtService: JwtService,
  ) {
    return new AuthenticateUserUsecase(gateway, passwordHasher, jwtService);
  }

  public async execute({
    email,
    password,
  }: AuthenticateUserInputDto): Promise<AuthenticateUserOutputDto> {
    const findUser = await this.userGateway.findByEmail(email);

    if (!findUser) {
      throw new Error("User with this email does not exist.");
    }

    const checkPassword = this.passwordHasher.compare(
      password,
      findUser.password,
    );

    if (!checkPassword) {
      throw new Error("Wrong password.");
    }

    const user = User.with({
      id: findUser.id,
      email: findUser.email,
      name: findUser.name,
      phone: findUser.phone,
      password: findUser.password,
      isAdmin: findUser.isAdmin,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
      deletedAt: findUser.deletedAt,
    });

    return this.presentOutput(user);
  }

  private presentOutput(user: User): AuthenticateUserOutputDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    const token = this.jwtService.sign(userData);

    const output: AuthenticateUserOutputDto = {
      token,
    };

    return output;
  }
}
