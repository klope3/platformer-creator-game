import { enemyDeathBounceForce, playerJumpForce, tileSize } from "./constants";
import { MovementType } from "../../platformer-creator-game-shared/typesGame";

export class Character extends Phaser.Physics.Arcade.Sprite {
  protected _facingLeft = false;
  protected _movementSpeed = 0;
  private _moveAnimationKey = "";
  private _idleAnimationKey = "";
  private _deathAnimationKey = "";
  private _dead = false;

  public get dead() {
    return this._dead;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    movementSpeed: number,
    moveAnimationKey: string,
    idleAnimationKey: string,
    deathAnimationKey: string
  ) {
    super(scene, x, y, texture);

    this._movementSpeed = movementSpeed;
    this._moveAnimationKey = moveAnimationKey;
    this._idleAnimationKey = idleAnimationKey;
    this._deathAnimationKey = deathAnimationKey;

    scene.add.existing(this);
    scene.physics.add.existing(this).setSize(tileSize, tileSize).refreshBody();
  }

  move(direction: MovementType) {
    if (this._dead) return;
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

  forceJump(force: number = playerJumpForce) {
    this.setVelocityY(0);
    this.body!.enable = false;
    this.body!.enable = true;
    this.setVelocityY(-1 * force);
  }

  die() {
    this.move("stop");
    this._dead = true;
    this.forceJump(enemyDeathBounceForce);
    this.anims.play(this._deathAnimationKey);
    setTimeout(() => {
      this.destroy();
    }, 3000);
  }

  setDead(value: boolean) {
    this._dead = value;
  }
}
