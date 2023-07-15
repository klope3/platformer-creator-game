import { Character } from "./Character";
import { animationKeys } from "./animations";
import { playerJumpForce, playerMoveSpeed } from "./constants";
import { textureKeys } from "./textureData";

export class Player extends Character {
  private _cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
  ) {
    super(
      scene,
      x,
      y,
      textureKeys.player,
      playerMoveSpeed,
      animationKeys.playerMove,
      animationKeys.playerIdle,
      animationKeys.playerDie
    );
    this._cursors = cursorKeys;
    scene.add.existing(this);
    scene.physics.add.existing(this).setSize(16, 16).refreshBody();
  }

  jump() {
    if (!this.body?.blocked.down && !this.dead) return;
    this.setVelocityY(-1 * playerJumpForce);
    const animationKey = this.dead
      ? animationKeys.playerDie
      : animationKeys.playerJumping;
    this.anims.play(animationKey);
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.dead) return;

    if (this._cursors?.left.isDown) {
      this.move("left");
    } else if (this._cursors?.right.isDown) {
      this.move("right");
    } else {
      this.move("stop");
    }
    if (this._cursors?.up.isDown) {
      this.jump();
    }
  }

  playerDeath(worldCollider: Phaser.Physics.Arcade.Collider) {
    this.move("stop");
    this.setDead(true);
    this.body!.enable = false;
    setTimeout(() => {
      this.body!.enable = true;
      this.jump();
      worldCollider.destroy();
    }, 1000);
  }
}
