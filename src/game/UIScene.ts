import { GameScene } from "./GameScene";

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UI", active: true });
  }

  create() {
    //  Grab a reference to the Game Scene
    let ourGame = this.scene.get("game-scene") as GameScene;
    console.log(ourGame);

    //  Our Text object to display the Score
    let info = this.add.text(10, 10, `Lives: ${ourGame.lives}`, {
      font: "12px Arial",
      color: "#ffffff",
    });

    //  Listen for events from it
    ourGame.events.on(
      "loseLife",
      () => {
        info.setText("Lives: " + ourGame.lives);
      },
      this
    );
  }
}
