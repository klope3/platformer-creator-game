import { z } from "zod";

export type MovementType = "left" | "right" | "stop";

const tileTypes = ["brick_green", "block_green"] as const;

const tileTypeSchema = z.enum(tileTypes);

export type TileType = z.infer<typeof tileTypeSchema>;

export type TileData = {
  type: TileType;
  tilesetIndex: number;
};

export type LevelTile = {
  position: Vector2;
  type: TileType;
};

export type Level = {
  playerPosition: Vector2;
  tiles: LevelTile[];
};

export type Vector2 = {
  x: number;
  y: number;
};
