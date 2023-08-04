import { TileData } from "../../platformer-creator-game-shared/types";

export const tileData: TileData[] = [
  {
    type: "brick_green",
    tilesetIndex: 0,
    solid: true,
  },
  {
    type: "block_green",
    tilesetIndex: 1,
    solid: true,
  },
  {
    type: "goal_bottom",
    tilesetIndex: 2,
    solid: false,
  },
  {
    type: "goal_top",
    tilesetIndex: 3,
    solid: false,
  },
];
