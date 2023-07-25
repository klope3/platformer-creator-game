import { gameLevelId } from "../../Game";
import { fetchedLevelDataSchema } from "../../types";
import { gameHeight, gameWidth } from "../constants";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super("loading-scene");
  }

  create() {
    this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000);
    const text = this.add.text(200, 150, "Loading...", {
      font: "30px Arial",
      color: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);

    this.getFetchResult()
      .then((result) => {
        if (result.data) {
          this.scene.start("game-scene", result.data);
        } else {
          text.setText("Error");
        }
      })
      .catch((e) => console.error(e));
  }

  async getFetchResult() {
    try {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        `http://localhost:3000/levels/${gameLevelId}`,
        requestOptions
      );
      if (!response.ok) {
        return {
          data: undefined,
        };
      }
      const json = await response.json();
      return { data: fetchedLevelDataSchema.parse(json) };
    } catch (error) {
      console.error(error);
      return {
        data: undefined,
      };
    }
  }
}
