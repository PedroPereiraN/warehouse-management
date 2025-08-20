import * as z from "zod";
import { Logger } from "../lib/logger";

export function formatZodError<T>(
  error: z.ZodSafeParseError<T>,
): Array<{ field: string; code: string; message: string }> {
  const errors = JSON.parse(error.error.message);
  const formatedErrors = errors.map(
    (err: { path: unknown[]; code: string; message: string }) => ({
      field: err.path.join("."),
      code: err.code,
      message: err.message,
    }),
  );

  Logger.error("", formatedErrors);

  return formatedErrors;
}
