import { z } from "zod";

export type MovementType = "left" | "right" | "stop";

const tileTypes = ["brick_green", "block_green"] as const;

const tileTypeSchema = z.enum(tileTypes);

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

export type Level = {
  playerPosition: Vector2;
  tiles: LevelTile[];
  characters: LevelCharacter[];
};

export type Vector2 = {
  x: number;
  y: number;
};

const characterTypes = ["player", "enemy"] as const;
const characterTypeSchema = z.enum(characterTypes);
export type CharacterType = z.infer<typeof characterTypeSchema>;
export type CharacterData = {
  type: CharacterType;
  textureKey: string;
};
type LevelCharacter = {
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
