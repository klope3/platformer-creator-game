import { gameHeight, gameWidth, sceneNames } from "../constants";

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super(sceneNames.victoryScene);
  }

  create() {
    const rect = this.add.rectangle(
      gameWidth / 2,
      gameHeight / 2,
      gameWidth * 0.75,
      gameHeight * 0.75,
      0x000000
    );
    rect.setAlpha(0.3);
    const text = this.add.text(gameWidth / 4, gameHeight / 4, "YOU WIN!", {
      font: "30px Arial",
      color: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);
  }
}
