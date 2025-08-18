import { Api } from "./api";
import express, { Express } from "express";
import { Route } from "./routes/route";
import { Logger } from "../../lib/logger";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

export class ApiExpress implements Api {
  private app: Express;

  private constructor(routes: Route[]) {
    this.app = express();
    this.app.use(express.json());
    // Enables CORS for all origins.
    this.app.use(cors());

    this.addRoutes(routes);
  }

  public static create(routes: Route[]) {
    return new ApiExpress(routes);
  }

  private addRoutes(routes: Route[]) {
    routes.forEach((route) => {
      const path = route.getPath();
      const method = route.getMethod();
      const handler = route.getHandler();
      Logger.info(`Registering route: [${method.toUpperCase()}] ${path}`);
      this.app[method](path, handler);
    });
  }

  public start(port: number) {
    this.app.listen(port, () => {
      Logger.info(`Server running on port ${port}`);
    });
  }
}
