import { z } from "zod";
import { dateParseableString } from "../validations";

export type MovementType = "left" | "right" | "stop";

const tileTypes = [
  "brick_green",
  "block_green",
  "goal_bottom",
  "goal_top",
] as const;
const tileTypeSchema = z.enum(tileTypes);

const characterTypes = ["player", "enemy"] as const;
const characterTypeSchema = z.enum(characterTypes);

const pickupTypes = ["default"] as const;
const pickupTypeSchema = z.enum(pickupTypes);

export type TileType = z.infer<typeof tileTypeSchema>;

export type TileData = {
  type: TileType;
  tilesetIndex: number;
  solid: boolean;
};

export type LevelTile = {
  position: Vector2;
  type: TileType;
};

export type LevelPickup = {
  type: PickupType;
  position: Vector2;
};

export const fetchedLevelSchema = z.object({
  characters: z.array(
    z.object({
      positionX: z.number(),
      positionY: z.number(),
      type: characterTypeSchema,
    })
  ),
  dateCreated: dateParseableString,
  dateUpdated: dateParseableString,
  description: z.string(),
  goalPositionX: z.number(),
  goalPositionY: z.number(),
  pickups: z.array(
    z.object({
      positionX: z.number(),
      positionY: z.number(),
      type: pickupTypeSchema,
    })
  ),
  playerPositionX: z.number(),
  playerPositionY: z.number(),
  private: z.boolean(),
  tiles: z.array(
    z.object({
      positionX: z.number(),
      positionY: z.number(),
      type: tileTypeSchema,
    })
  ),
  title: z.string(),
});

export type Level = {
  playerPosition: Vector2;
  tiles: LevelTile[];
  characters: LevelCharacter[];
  pickups: LevelPickup[];
  goalPosition: Vector2;
};

export type Vector2 = {
  x: number;
  y: number;
};
export type CharacterType = z.infer<typeof characterTypeSchema>;
export type CharacterData = {
  type: CharacterType;
  textureKey: string;
};
export type LevelCharacter = {
  type: CharacterType;
  position: Vector2;
};

export type TextureData = {
  key: string;
  path: string;
  type: "normal" | "sheet";
  frameWidth?: number;
  frameHeight?: number;
};

export type PickupType = z.infer<typeof pickupTypeSchema>;
