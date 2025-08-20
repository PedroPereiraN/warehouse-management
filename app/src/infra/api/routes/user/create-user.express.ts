import { Route, HttpMethod } from "../route";
import { Request, Response } from "express";
import { CreateUserUsecase } from "../../../../usecases/user/create-user.usecase";
import {
  CreateUserInputDto,
  CreateUserResponseDto,
} from "../../../../dtos/user";
import * as z from "zod";
import { Logger } from "../../../../lib/logger";
import { formatZodErrors } from "../../../../helpers/format-zod-errors";
import { Prisma } from "../../../../generated/prisma";
import { formatPrismaErrors } from "../../../../helpers/format-prisma-errors";

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
      password: z.string().min(6),
      isAdmin: z.boolean().default(false),
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

      const { email, name, phone, password, isAdmin } = request.body;

      const input: CreateUserInputDto = {
        email,
        name,
        phone,
        password,
        isAdmin,
      };

      Logger.info("User input: ", {
        email,
        name,
        phone,
        isAdmin,
      });

      const result = this.validate(input);

      if (!result.success) {
        response.status(400).json({ errors: formatZodErrors(result) });
        return;
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
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaFormatedErrors = formatPrismaErrors(error);

            switch (error.code.toLowerCase()) {
              case "p2002":
                return response
                  .status(409)
                  .json({ errors: prismaFormatedErrors });
              case "p2025":
                return response
                  .status(404)
                  .json({ errors: prismaFormatedErrors });
              case "p2003":
                return response
                  .status(400)
                  .json({ errors: prismaFormatedErrors });
              default:
                return response
                  .status(400)
                  .json({ errors: prismaFormatedErrors });
            }
          }
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

  private present(input: CreateUserResponseDto): CreateUserResponseDto {
    const response = { id: input.id };
    return response;
  }

  private presentError(error: Error) {
    let code = 500;

    if (error.message.toLowerCase().includes("already in use")) {
      code = 400;
    }
    const response = {
      message: error.message,
      code,
    };

    return response;
  }
}
