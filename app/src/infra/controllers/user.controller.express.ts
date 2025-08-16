import { Request, Response } from "express";
import { CreateUserUsecase } from "../../usecases/user/create-user.usecase";
import { CreateUserInputDto } from "../../dtos/user";

export class UserController {
  private constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  public static create(createUserUsecase: CreateUserUsecase) {
    return new UserController(createUserUsecase);
  }

  public async createUser(req: Request, res: Response) {
    const { email, name, phone, cpf, password, isAdmin } = req.body;
    const input: CreateUserInputDto = {
      email,
      name,
      phone,
      cpf,
      password,
      isAdmin,
    };

    return await this.createUserUsecase
      .execute(input)
      .then((output) => {
        return res.status(200).json(output);
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  }
}
