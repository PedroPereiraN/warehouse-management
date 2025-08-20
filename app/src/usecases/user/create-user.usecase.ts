import { User } from "../../domain/entity/user.entity";
import { UserGateway } from "../../domain/gateway/user.gateway";
import { CreateUserInputDto, CreateUserOutputDto } from "../../dtos/user";
import { Usecase } from "../usecase";
import { PasswordHasher } from "../../services/bcrypt-password-hasher";

export class CreateUserUsecase
  implements Usecase<CreateUserInputDto, CreateUserOutputDto>
{
  private constructor(
    private readonly userGateway: UserGateway,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public static create(gateway: UserGateway, passwordHasher: PasswordHasher) {
    return new CreateUserUsecase(gateway, passwordHasher);
  }

  public async execute({
    email,
    name,
    phone,
    cpf,
    password,
    isAdmin,
  }: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const hash = await this.passwordHasher.hash(password);

    const user = User.create({
      email,
      name,
      phone,
      password: hash,
      cpf,
      isAdmin,
    });

    await this.userGateway.save(user);

    return this.presentOutput(user);
  }

  private presentOutput(user: User): CreateUserOutputDto {
    const output: CreateUserOutputDto = {
      id: user.values.id,
    };

    return output;
  }
}
