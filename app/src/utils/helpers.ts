import * as z from "zod";

export function formatZodError<T>(
  error: z.ZodSafeParseError<T>,
): Array<{ field: string; code: string; message: string }> {
  const errors = JSON.parse(error.error.message);
  return errors.map((err) => ({
    field: err.path.join("."),
    code: err.code,
    message: err.message,
  }));
}
