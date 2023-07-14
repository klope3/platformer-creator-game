import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { initAnimations } from "./animations";
import { tileSize } from "./constants";
import { testMap } from "./testMap";
import { textureData } from "./textureData";
import { tileData } from "./tiles";

export class GameScene extends Phaser.Scene {
  private player?: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("game-scene");
  }

  preload() {
    for (const data of textureData) {
      if (data.type === "sheet") {
        if (data.frameWidth === undefined || data.frameHeight === undefined)
          console.error("Bad sprite sheet data!");
        this.load.spritesheet(data.key, data.path, {
          frameWidth: data.frameWidth!,
          frameHeight: data.frameHeight,
        });
      } else this.load.image(data.key, data.path);
    }
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
    this.cursors = this.input.keyboard?.createCursorKeys();

    this.player = new Player(
      this,
      testMap.playerPosition.x * tileSize + tileSize / 2,
      testMap.playerPosition.y * tileSize + tileSize / 2,
      this.cursors!
    );

    const e = new Enemy(
      this,
      9 * tileSize + tileSize / 2,
      3 * tileSize + tileSize / 2
    );

    this.physics.add.collider(this.player, layer!);
    this.physics.add.collider(e, layer!);
  }
}
