import { tileSize } from "./constants";
import { FetchedLevelData } from "../../platformer-creator-game-shared/typesFetched";
import {
  LevelCharacter,
  LevelPickup,
  LevelTile,
  Vector2,
  Level,
} from "../../platformer-creator-game-shared/typesGame";
// import { FetchedLevelData } from "../";

export function tileToPixelPosition(x: number, y: number): Vector2 {
  return {
    x: x * tileSize + tileSize / 2,
    y: y * tileSize + tileSize / 2,
  };
}

export function convertFetchedLevel(fetchedLevel: FetchedLevelData): Level {
  const level: Level = {
    id: fetchedLevel.id,
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

export function formatMilliseconds(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remainingMilliseconds = Math.round(ms) % 1000;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const formattedMilliseconds = String(remainingMilliseconds).padStart(3, "0");

  return `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}
