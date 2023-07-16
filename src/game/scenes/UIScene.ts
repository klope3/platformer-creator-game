import { GameScene } from "./GameScene";

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UI", active: true });
  }

  create() {
    const gameScene = this.scene.get("game-scene") as GameScene;
    const textStyle = {
      font: "12px Arial",
      color: "#ffffff",
    };

    const livesText = this.add.text(
      10,
      10,
      `Lives: ${gameScene.lives}`,
      textStyle
    );
    const pointsText = this.add.text(
      10,
      25,
      `Score: ${gameScene.points}`,
      textStyle
    );

    //  Listen for events from it
    gameScene.events.on(
      "onChangeLives",
      () => {
        livesText.setText("Lives: " + gameScene.lives);
      },
      this
    );

    gameScene.events.on(
      "onChangePoints",
      () => {
        pointsText.setText(`Score: ${gameScene.points}`);
      },
      this
    );
  }
}
