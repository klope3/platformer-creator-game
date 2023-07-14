import { tileSize } from "./constants";
import { MovementType } from "./types";

export class Character extends Phaser.Physics.Arcade.Sprite {
  protected _facingLeft = false;
  protected _movementSpeed = 0;
  private _moveAnimationKey = "";
  private _idleAnimationKey = "";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    movementSpeed: number,
    moveAnimationKey: string,
    idleAnimationKey: string
  ) {
    super(scene, x, y, texture);

    this._movementSpeed = movementSpeed;
    this._moveAnimationKey = moveAnimationKey;
    this._idleAnimationKey = idleAnimationKey;

    scene.add.existing(this);
    scene.physics.add.existing(this).setSize(tileSize, tileSize).refreshBody();
  }

  move(direction: MovementType) {
    let velocity = 0;
    if (direction === "left") velocity = -1 * this._movementSpeed;
    if (direction === "right") velocity = this._movementSpeed;

    this.setVelocityX(velocity);
    this._facingLeft = velocity < 0 || (velocity === 0 && this._facingLeft);
    this.setFlipX(this._facingLeft);

    if (!this.body?.blocked.down) return;
    if (velocity !== 0) this.anims.play(this._moveAnimationKey, true);
    else this.anims.play(this._idleAnimationKey, true);
  }
}
