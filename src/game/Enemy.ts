import { Character } from "./Character";
import { animationKeys } from "./animations";
import { enemyMoveSpeed } from "./constants";
import { textureKeys } from "./textureData";

export class Enemy extends Character {
  private _timer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      textureKeys.enemy,
      enemyMoveSpeed,
      animationKeys.enemyMove,
      animationKeys.enemyIdle
    );
    this.move("left");
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    this._timer += delta;
    if (this._timer > 1000) {
      this._timer = 0;
      if (this._facingLeft) this.move("right");
      else this.move("left");
    }
  }
}
