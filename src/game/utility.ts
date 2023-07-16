import { z } from "zod";
import { tileSize } from "./constants";
import {
  Level,
  LevelCharacter,
  LevelPickup,
  LevelTile,
  Vector2,
  fetchedLevelSchema,
} from "./types";

export function tileToPixelPosition(x: number, y: number): Vector2 {
  return {
    x: x * tileSize + tileSize / 2,
    y: y * tileSize + tileSize / 2,
  };
}

export function convertFetchedLevel(
  fetchedLevel: z.infer<typeof fetchedLevelSchema>
): Level {
  const level: Level = {
    goalPosition: {
      x: fetchedLevel.goalPositionX,
      y: fetchedLevel.goalPositionY,
    },
    playerPosition: {
      x: fetchedLevel.playerPositionX,
      y: fetchedLevel.playerPositionY,
    },
    tiles: fetchedLevel.tiles.map((fetchedTile) => {
      const tile: LevelTile = {
        position: {
          x: fetchedTile.positionX,
          y: fetchedTile.positionY,
        },
        type: fetchedTile.type,
      };
      return tile;
    }),
    characters: fetchedLevel.characters.map((fetchedCharacter) => {
      const character: LevelCharacter = {
        position: {
          x: fetchedCharacter.positionX,
          y: fetchedCharacter.positionY,
        },
        type: fetchedCharacter.type,
      };
      return character;
    }),
    pickups: fetchedLevel.pickups.map((fetchedPickup) => {
      const pickup: LevelPickup = {
        position: {
          x: fetchedPickup.positionX,
          y: fetchedPickup.positionY,
        },
        type: fetchedPickup.type,
      };
      return pickup;
    }),
  };
  return level;
}
