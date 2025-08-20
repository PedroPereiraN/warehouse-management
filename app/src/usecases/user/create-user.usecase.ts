import { User } from "../../domain/entity/user.entity";
import { UserGateway } from "../../domain/gateway/user.gateway";
import { CreateUserInputDto, CreateUserOutputDto } from "../../dtos/user";
import { Usecase } from "../usecase";
import { PasswordHasher } from "../../domain/gateway/password-hasher.gateway";

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
    if (email) {
      const checkEmail = await this.userGateway.findByEmail(email);

      if (checkEmail) {
        throw new Error("Email already in use");
      }
    }

    if (phone) {
      const checkPhone = await this.userGateway.findByPhone(phone);

      if (checkPhone) {
        throw new Error("Phone already in use");
      }
    }

    const checkCpf = await this.userGateway.findByCpf(cpf);

    if (checkCpf) {
      throw new Error("CPF already in use");
    }

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
