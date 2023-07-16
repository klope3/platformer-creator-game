import { z } from "zod";

export const dateParseableString = z
  .string()
  .refine((str) => !isNaN(new Date(str).getTime()));
