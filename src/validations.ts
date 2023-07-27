import { z } from "zod";
import { fetchedLevelResultSchema } from "./types";

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

export function parseLevelSearchResultsJson(json: any) {
  const schema = z.array(fetchedLevelResultSchema);
  return schema.parse(json);
}
