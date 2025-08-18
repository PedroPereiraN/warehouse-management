import { Route, HttpMethod } from "../route";
import { Request, Response } from "express";
import { CreateUserUsecase } from "../../../../usecases/user/create-user.usecase";
import {
  CreateUserInputDto,
  CreateUserResponseDto,
} from "../../../../dtos/user";

export class CreateUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

  public static create(createUserUsecase: CreateUserUsecase) {
    return new CreateUserRoute("/user", HttpMethod.POST, createUserUsecase);
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { email, name, phone, cpf, password, isAdmin } = request.body;

      const input: CreateUserInputDto = {
        email,
        name,
        phone,
        cpf,
        password,
        isAdmin,
      };

      await this.createUserUsecase
        .execute(input)
        .then((output) => {
          const responseBody = this.present(output);
          response.status(201).json(responseBody);
        })
        .catch((error) => {
          return response.status(500).json({ error: error.message });
        });
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  private present(input: CreateUserResponseDto): CreateUserResponseDto {
    const response = { id: input.id };
    return response;
  }
}
