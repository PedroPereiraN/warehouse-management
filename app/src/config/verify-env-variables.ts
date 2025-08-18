import { Logger } from "../lib/logger";

export function verifyEnvVariables() {
  if (!process.env.PORT) {
    Logger.warn("Consider specifying a default port in the .env file.");
  }

  if (!process.env.VIRTUAL_ENVIRONMENT) {
    Logger.warn(
      "Please make sure to define a default virtual environment in the .env file for consistency.",
    );
  }

  if (!process.env.DATABASE_URL) {
    Logger.warn("You must specify the database URL in the .env file.");
  }
}
