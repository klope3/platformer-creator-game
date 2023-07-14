import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { initAnimations } from "./animations";
import { levelHeight, levelWidth, tileSize } from "./constants";
import { testMap } from "./testMap";
import { textureData, textureKeys } from "./textureData";
import { tileData } from "./tiles";
import { tileToPixelPosition } from "./utility";

export class GameScene extends Phaser.Scene {
  private _player?: Player;
  private _cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private _map?: Phaser.Tilemaps.Tilemap;
  private _lives = 3;

  public get lives(): number {
    return this._lives;
  }

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
    initAnimations(this);
    this._cursors = this.input.keyboard?.createCursorKeys();

    const buildMapResult = this.buildMap();
    if (!buildMapResult) return;
    const { solidLayer } = buildMapResult;

    const { player, enemies } = this.placeCharacters();

    const playerWorldCollider = this.physics.add.collider(player, solidLayer);
    this.physics.add.collider(enemies, solidLayer);

    const playerEnemyOverlap = this.physics.add.overlap(player, enemies, () => {
      playerEnemyOverlap.destroy();

      player.die(playerWorldCollider);
      this._lives--;
      this.events.emit("removeLife");
      for (const enemy of enemies.children.entries) {
        if (!(enemy instanceof Enemy)) continue;
        enemy.setFrozen(true);
      }
      setTimeout(() => {
        this.scene.restart();
      }, 3000);
    });
  }

  buildMap() {
    //initialize
    this._map = this.make.tilemap({
      width: levelWidth,
      height: levelHeight,
      tileWidth: tileSize,
      tileHeight: tileSize,
    });
    const tileset = this._map.addTilesetImage(textureKeys.tiles);
    const layer = this._map.createBlankLayer("platforms", tileset!);
    //find matching data and place tiles
    for (const tile of testMap.tiles) {
      const matchingTileData = tileData.find((data) => tile.type === data.type);
      if (matchingTileData === undefined) {
        console.error(
          "Couldn't find a tilesetIndex for a tile of type " + tile.type
        );
        return;
      }
      this._map.putTileAt(
        matchingTileData.tilesetIndex,
        tile.position.x,
        tile.position.y,
        true,
        layer!
      );
    }
    //set collision
    const collisionIndices = tileData
      .map((data) => (data.solid ? data.tilesetIndex : -1))
      .filter((item) => item !== -1);
    this._map.setCollision(collisionIndices);

    return {
      solidLayer: layer!,
    };
  }

  placeCharacters() {
    const playerPosition = tileToPixelPosition(
      testMap.playerPosition.x,
      testMap.playerPosition.y
    );
    this._player = new Player(
      this,
      playerPosition.x,
      playerPosition.y,
      this._cursors!
    );
    this._player.setCollideWorldBounds(true);

    const enemies = this.physics.add.group();
    for (const character of testMap.characters) {
      const position = tileToPixelPosition(
        character.position.x,
        character.position.y
      );
      const newCharacter = new Enemy(this, position.x, position.y);
      newCharacter.setCollideWorldBounds(true);
      enemies.add(newCharacter);
    }

    return {
      player: this._player!,
      enemies,
    };
  }
}
