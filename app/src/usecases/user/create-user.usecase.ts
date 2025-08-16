import { User } from "../../domain/entity/user.entity";
import { UserGateway } from "../../domain/gateway/user.gateway";
import { CreateUserInputDto, CreateUserOutputDto } from "../../dtos/user";
import { Usecase } from "../usecase";

export class CreateUserUsecase
  implements Usecase<CreateUserInputDto, CreateUserOutputDto>
{
  private constructor(private readonly userGateway: UserGateway) {}

  public static create(gateway: UserGateway) {
    return new CreateUserUsecase(gateway);
  }

  public async execute({
    email,
    name,
    phone,
    cpf,
    password,
    isAdmin,
  }: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const user = User.create({
      email,
      name,
      phone,
      password,
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
