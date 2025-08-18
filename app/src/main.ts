import express from "express";
import cors from "cors";
import { CreateUserUsecase } from "./usecases/user/create-user.usecase";
import { UserController } from "./infra/controllers/user.controller.express";
import { UserRepositoryPrisma } from "./infra/repositories/user.repository.prisma";
import prisma from "./lib/prisma";
import { Request, Response } from "express";
import { verifyEnvVariables } from "./config/verify-env-variables";
import { Logger } from "./lib/logger";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

// Enables CORS for all origins.
app.use(cors());

verifyEnvVariables();

// user
const uRepository = UserRepositoryPrisma.create(prisma);
const uCreateUsecase = CreateUserUsecase.create(uRepository);
const uController = UserController.create(uCreateUsecase);

app.post("/user", (req: Request, res: Response) =>
  uController.createUser(req, res),
);

app.listen(port, () => {
  Logger.info(`Server running on port ${port}`);
});
