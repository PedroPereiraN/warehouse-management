import { CreateUserUsecase } from "./usecases/user/create-user.usecase";
import { UserRepositoryPrisma } from "./infra/repositories/user.repository.prisma";
import prisma from "./lib/prisma";
import { verifyEnvVariables } from "./config/verify-env-variables";
import { ApiExpress } from "./infra/api/express";
import { CreateUserRoute } from "./infra/api/routes/user/create-user.express";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

verifyEnvVariables();

// user
const uRepository = UserRepositoryPrisma.create(prisma);
const uCreateUsecase = CreateUserUsecase.create(uRepository);
const uCreateUserRoute = CreateUserRoute.create(uCreateUsecase);

const api = ApiExpress.create([uCreateUserRoute]);

api.start(port);
