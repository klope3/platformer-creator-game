import { Player } from "./Player";
import { initAnimations } from "./animations";
import { tileSize } from "./constants";
import { testMap } from "./testMap";
import { tileData } from "./tiles";

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
    this.load.image("tiles", "assets/tiles.png");
  }

  create() {
    const map = this.make.tilemap({
      width: 50,
      height: 50,
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = map.addTilesetImage("tiles");
    const layer = map.createBlankLayer("platforms", tileset!);
    for (const tile of testMap.tiles) {
      const matchingTileData = tileData.find((data) => tile.type === data.type);
      if (matchingTileData === undefined) {
        console.error(
          "Couldn't find a tilesetIndex for a tile of type " + tile.type
        );
        return;
      }
      map.putTileAt(
        matchingTileData.tilesetIndex,
        tile.position.x,
        tile.position.y,
        true,
        layer!
      );
    }
    map.setCollision([0, 1]);

    initAnimations(this);

    this.player = new Player(
      this,
      testMap.playerPosition.x * tileSize + tileSize / 2,
      testMap.playerPosition.y * tileSize + tileSize / 2,
      "tofuman"
    );
    this.physics.add.collider(this.player, layer!);
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
