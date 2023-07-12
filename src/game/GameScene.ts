import { Player } from "./Player";
import { initAnimations } from "./animations";

export class GameScene extends Phaser.Scene {
  private player?: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("game-scene");
  }

  preload() {
    this.load.spritesheet("tofuman", "assets/tofuman.png", {
      frameWidth: 16 * 3,
      frameHeight: 16,
    });
    this.load.image("brick_green", "assets/brick_green.png");
  }

  create() {
    const { physics } = this;
    const platforms = physics.add.staticGroup();
    for (let i = 0; i < 20; i++) {
      platforms
        .create(i * 32 + 16, 16 * 30, "brick_green")
        .setScale(2)
        .refreshBody();
    }

    initAnimations(this);

    this.player = new Player(this, 300, 300, "tofuman");
    physics.add.collider(this.player, platforms);
    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  update() {
    const { cursors, player } = this;
    if (cursors?.left.isDown) {
      player?.move("left");
    } else if (cursors?.right.isDown) {
      player?.move("right");
    } else {
      player?.move("stop");
    }
    if (cursors?.up.isDown) {
      player?.jump();
    }
  }
}
