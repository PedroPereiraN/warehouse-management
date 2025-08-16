import { isoRegex } from "./regex";

export const isValidISODate = (date: string): boolean => {
  const parsed = Date.parse(date);
  if (isNaN(parsed)) return false;

  return isoRegex.test(date);
};
