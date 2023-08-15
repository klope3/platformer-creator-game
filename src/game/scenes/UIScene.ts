import { eventNames, sceneNames } from "../constants";
import { formatMilliseconds } from "../utility";
import { GameScene } from "./GameScene";

export class UIScene extends Phaser.Scene {
  private _timerText?: Phaser.GameObjects.Text;
  private _gameScene?: GameScene;

  constructor() {
    super({ key: sceneNames.uiScene, active: true });
  }

  create() {
    this._gameScene = this.scene.get(sceneNames.gameScene) as GameScene;
    const gameScene = this._gameScene;
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
    this._timerText = this.add.text(400, 10, `0:00:00`, textStyle);
    this._timerText.setOrigin(1, 0);

    gameScene.events.on(
      eventNames.onChangeLives,
      () => {
        livesText.setText("Lives: " + gameScene.lives);
      },
      this
    );

    gameScene.events.on(
      eventNames.onChangePoints,
      () => {
        pointsText.setText(`Score: ${gameScene.points}`);
      },
      this
    );
  }

  update() {
    if (!this._gameScene) return;
    const ms = this._gameScene.timeMs;
    this._timerText?.setText(formatMilliseconds(ms));
  }
}
