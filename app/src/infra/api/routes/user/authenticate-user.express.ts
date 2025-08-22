import { Route, HttpMethod } from "../route";
import { Request, Response } from "express";
import {
  AuthenticateUserInputDto,
  AuthenticateUserOutputDto,
  AuthenticateUserResponseDto,
} from "../../../../dtos/user";
import * as z from "zod";
import { Logger } from "../../../../lib/logger";
import { formatZodErrors } from "../../../../helpers/format-zod-errors";
import { AuthenticateUserUsecase } from "../../../../usecases/user/authenticate-user.usecase";

export class AuthenticateUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly authenticateUserUsecase: AuthenticateUserUsecase,
  ) {}

  public static create(authenticateUserUsecase: AuthenticateUserUsecase) {
    return new AuthenticateUserRoute(
      "/users/auth",
      HttpMethod.POST,
      authenticateUserUsecase,
    );
  }

  private validate(values: AuthenticateUserInputDto) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const parsed = schema.safeParse(values);

    return parsed;
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      Logger.info(
        "Route called: ",
        `[${this.getMethod().toUpperCase()}] ${this.getPath()}`,
      );

      const { email, password } = request.body;

      const input: AuthenticateUserInputDto = {
        email,
        password,
      };

      Logger.info("User input: ", {
        email,
      });

      const result = this.validate(input);

      if (!result.success) {
        response.status(400).json({ errors: formatZodErrors(result) });
        return;
      }

      await this.authenticateUserUsecase
        .execute(input)
        .then((output) => {
          const responseBody = this.present(output);
          Logger.info("Authenticate successfuly");

          response.status(201).json(responseBody);
          return;
        })
        .catch((error) => {
          const errorInfo = this.presentError(error);

          Logger.error("", errorInfo);

          response.status(errorInfo.code).json({ error: errorInfo.message });
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

  private present(
    input: AuthenticateUserOutputDto,
  ): AuthenticateUserResponseDto {
    const response = { token: input.token };
    return response;
  }

  private presentError(error: Error) {
    const code = 500;

    const response = {
      message: error.message,
      code,
    };

    return response;
  }
}
