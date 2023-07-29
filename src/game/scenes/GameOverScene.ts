import { gameHeight, gameWidth, sceneNames } from "../constants";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(sceneNames.gameOverScene);
  }

  create() {
    this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000);
    const text = this.add.text(200, 150, "GAME OVER", {
      font: "30px Arial",
      color: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);
  }
}
