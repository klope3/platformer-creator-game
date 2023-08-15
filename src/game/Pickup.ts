import { animationKeys } from "./animations";
import { textureKeys } from "./textureData";

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, textureKeys.pointPickup);
    scene.add.existing(this);
    this.anims.play(animationKeys.pointPickupIdle);
  }
}
