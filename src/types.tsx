import { z } from "zod";
// import { dateParseableString } from "./validations";
import {
  characterTypeSchema,
  pickupTypeSchema,
  tileTypeSchema,
} from "./game/types";

export const dateParseableString = z
  .string()
  .refine((str) => !isNaN(new Date(str).getTime()));

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
});

//properties that the following two schema have in common.
const fetchedLevelBaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  private: z.boolean(),
  dateCreated: dateParseableString,
  dateUpdated: dateParseableString,
  userId: z.number(),
  user: z.object({
    username: z.string(),
  }),
});

//the schema for level data used to build levels in the game.
export const fetchedLevelDataSchema = fetchedLevelBaseSchema.extend({
  goalPositionX: z.number(),
  goalPositionY: z.number(),
  playerPositionX: z.number(),
  playerPositionY: z.number(),
  characters: z.array(
    z.object({
      positionX: z.number(),
      positionY: z.number(),
      type: characterTypeSchema,
    })
  ),
  pickups: z.array(
    z.object({
      positionX: z.number(),
      positionY: z.number(),
      type: pickupTypeSchema,
    })
  ),
  tiles: z.array(
    z.object({
      positionX: z.number(),
      positionY: z.number(),
      type: tileTypeSchema,
    })
  ),
});

//the schema for level data that's fetched as part of a search.
//does not include data for building the level (characters, tiles, etc.)
export const fetchedLevelResultSchema = fetchedLevelBaseSchema.extend({
  averageRating: z.number(),
  totalRatings: z.number(),
  totalCompletions: z.number(),
});

export type FetchedLevelResult = z.infer<typeof fetchedLevelResultSchema>;

export type FetchedLevelData = z.infer<typeof fetchedLevelDataSchema>;

export type User = z.infer<typeof userSchema>;
