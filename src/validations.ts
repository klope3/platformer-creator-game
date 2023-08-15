import { z } from "zod";
import {
  fetchedLevelResultSchema,
  levelCompletionSchema,
} from "../platformer-creator-game-shared/typesFetched";

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

export function parseLevelCompletionCallback(cb: any) {
  const schema = z.function().args(z.number(), z.number());
  return schema.parse(cb);
}

export function parseLevelCompletions(json: any) {
  const schema = z.array(levelCompletionSchema);
  return schema.parse(json);
}

export const checkValidPassword = (input: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,20}$/g.test(input);

export const validPasswordMessage =
  "Password must be 8-20 characters, including at least one capital letter, at least one small letter, one number and one special character - !@#$%^&*()_+";
