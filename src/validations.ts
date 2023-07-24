import { z } from "zod";

export const dateParseableString = z
  .string()
  .refine((str) => !isNaN(new Date(str).getTime()));

export function parseAuthJson(json: any) {
  const schema = z.object({
    token: z.string(),
    username: z.string(),
    email: z.string(),
  });
  return schema.parse(json);
}

export function parseMessageJson(json: any) {
  const schema = z.object({
    message: z.string(),
  });
  return schema.parse(json);
}

export function parseObjWithId(obj: any) {
  const schema = z.object({
    id: z.number(),
  });
  return schema.parse(obj);
}
