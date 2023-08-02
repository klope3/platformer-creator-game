import { characterPaths, environmentPaths } from "../assetPaths";
import { tileSize } from "./constants";
import { TextureData } from "./types";

export const textureKeys = {
  player: "tofuman",
  enemy: "enemy",
  tiles: "tiles",
  pointPickup: "pointPickup",
};

export const textureData: TextureData[] = [
  {
    key: textureKeys.player,
    path: characterPaths.playerSheet,
    type: "sheet",
    frameWidth: tileSize * 3,
    frameHeight: tileSize,
  },
  {
    key: textureKeys.enemy,
    path: characterPaths.enemySheet,
    type: "sheet",
    frameWidth: tileSize * 3,
    frameHeight: tileSize,
  },
  {
    key: textureKeys.tiles,
    path: environmentPaths.tiles,
    type: "normal",
  },
  {
    key: textureKeys.pointPickup,
    path: environmentPaths.pointPickup,
    type: "sheet",
    frameWidth: tileSize,
    frameHeight: tileSize,
  },
];
