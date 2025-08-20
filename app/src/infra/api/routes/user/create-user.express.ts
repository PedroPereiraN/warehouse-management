import { Route, HttpMethod } from "../route";
import { Request, Response } from "express";
import { CreateUserUsecase } from "../../../../usecases/user/create-user.usecase";
import {
  CreateUserInputDto,
  CreateUserResponseDto,
} from "../../../../dtos/user";
import * as z from "zod";
import { Logger } from "../../../../lib/logger";
import { formatZodError } from "../../../../utils/helpers";

export class CreateUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

  public static create(createUserUsecase: CreateUserUsecase) {
    return new CreateUserRoute("/users", HttpMethod.POST, createUserUsecase);
  }

  private validate(values: CreateUserInputDto) {
    const schema = z.object({
      email: z.string().email().optional(),
      name: z.string().min(2),
      phone: z.string().min(11).max(11).optional(),
      cpf: z.string().min(11).max(11),
      password: z.string().min(6),
      isAdmin: z.boolean().default(false),
    });

    const parsed = schema.safeParse(values);

    return parsed;
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

      Logger.info("User input: ", input);

      const result = this.validate(input);

      if (!result.success) {
        Logger.error("", formatZodError(result));

        response.status(400).json({ errors: formatZodError(result) });
        return;
      } else {
        Logger.info("Zod schema validation result: ", result);
      }

      await this.createUserUsecase
        .execute(input)
        .then((output) => {
          const responseBody = this.present(output);
          Logger.info("User created successfully: ", responseBody);

          response.status(201).json(responseBody);
          return;
        })
        .catch((error) => {
          const responseBody = this.presentError(error);

          Logger.error("Error creating user: ", responseBody);

          response.status(500).json(responseBody);
          return;
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

  private presentError(error: Error) {
    const response = {
      error: error.message,
    };

    return response;
  }
}
