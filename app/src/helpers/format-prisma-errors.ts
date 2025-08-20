import { Prisma } from "../generated/prisma";
import { Logger } from "../lib/logger";

type FormattedPrismaError = {
  code: string;
  field?: string;
  message: string;
};

export function formatPrismaErrors(
  error: Prisma.PrismaClientKnownRequestError,
): FormattedPrismaError[] {
  if (error.code === "P2002") {
    const fields = (error.meta?.target as string[]) || [];
    const formattedErrors = fields.map((field) => ({
      code: error.code,
      field,
      message: `Unique constraint failed on field: ${field}`,
    }));

    Logger.error("Prisma error", formattedErrors);
    return formattedErrors;
  }

  const formattedError = [
    {
      code: error.code,
      message: error.message,
    },
  ];
  Logger.error("Prisma error", formattedError);
  return formattedError;
}
