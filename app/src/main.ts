import { CreateUserUsecase } from "./usecases/user/create-user.usecase";
import { UserRepositoryPrisma } from "./infra/repositories/user.repository.prisma";
import prisma from "./lib/prisma";
import { verifyEnvVariables } from "./config/verify-env-variables";
import { ApiExpress } from "./infra/api/express";
import { CreateUserRoute } from "./infra/api/routes/user/create-user.express";
import { BcryptPasswordHasher } from "./services/bcrypt-password-hasher";
import { AuthenticateUserUsecase } from "./usecases/user/authenticate-user.usecase";
import { JsonwebtokenService } from "./services/jsonwebtoken";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const secretKey = process.env.JWT_SECRET;

verifyEnvVariables();

// user
const bcryptPasswordHasher = BcryptPasswordHasher.create();
const jsonwebtokenService = JsonwebtokenService.create(secretKey!);
const uRepository = UserRepositoryPrisma.create(prisma);
const uCreateUsecase = CreateUserUsecase.create(
  uRepository,
  bcryptPasswordHasher,
);
const uAuthenticateUser = AuthenticateUserUsecase.create(
  uRepository,
  bcryptPasswordHasher,
  jsonwebtokenService,
);

const uCreateUserRoute = CreateUserRoute.create(uCreateUsecase);

const api = ApiExpress.create([uCreateUserRoute]);

api.start(port);
