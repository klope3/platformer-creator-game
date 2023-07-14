import { tileSize } from "./constants";
import { Vector2 } from "./types";

export function tileToPixelPosition(x: number, y: number): Vector2 {
  return {
    x: x * tileSize + tileSize / 2,
    y: y * tileSize + tileSize / 2,
  };
}
