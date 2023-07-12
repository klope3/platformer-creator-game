import { animationKeys } from "./animations";
import { playerJumpForce, playerMoveSpeed } from "./constants";
import { MovementType } from "./types";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private _facingLeft = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this).setSize(16, 16).setScale(2).refreshBody();
  }

  jump() {
    if (!this.body?.touching.down) return;
    this.setVelocityY(-1 * playerJumpForce);
    this.anims.play(animationKeys.jumping);
  }

  move(direction: MovementType) {
    let velocity = 0;
    if (direction === "left") velocity = -1 * playerMoveSpeed;
    if (direction === "right") velocity = playerMoveSpeed;

    this.setVelocityX(velocity);
    this._facingLeft = velocity < 0 || (velocity === 0 && this._facingLeft);
    this.setFlipX(this._facingLeft);

    if (!this.body?.touching.down) return;
    if (velocity !== 0) this.anims.play(animationKeys.move, true);
    else this.anims.play(animationKeys.idle, true);
  }
}
