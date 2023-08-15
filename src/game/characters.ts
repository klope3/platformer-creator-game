import { textureKeys } from "./textureData";
import { CharacterData } from "../../platformer-creator-game-shared/typesGame";

export const characterData: CharacterData[] = [
  {
    type: "player",
    textureKey: textureKeys.player,
  },
  {
    type: "enemy",
    textureKey: textureKeys.enemy,
  },
];
