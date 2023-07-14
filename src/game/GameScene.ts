import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { initAnimations } from "./animations";
import { levelHeight, levelWidth, tileSize } from "./constants";
import { testMap } from "./testMap";
import { textureData, textureKeys } from "./textureData";
import { tileData } from "./tiles";
import { tileToPixelPosition } from "./utility";

export class GameScene extends Phaser.Scene {
  private player?: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private map?: Phaser.Tilemaps.Tilemap;

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
    this.cursors = this.input.keyboard?.createCursorKeys();

    const buildMapResult = this.buildMap();
    if (!buildMapResult) return;

    const placeCharactersResult = this.placeCharacters();

    [placeCharactersResult.player, placeCharactersResult.enemies].forEach(
      (item) => this.physics.add.collider(item, buildMapResult.solidLayer)
    );
  }

  buildMap() {
    //initialize
    this.map = this.make.tilemap({
      width: levelWidth,
      height: levelHeight,
      tileWidth: tileSize,
      tileHeight: tileSize,
    });
    const tileset = this.map.addTilesetImage(textureKeys.tiles);
    const layer = this.map.createBlankLayer("platforms", tileset!);
    //find matching data and place tiles
    for (const tile of testMap.tiles) {
      const matchingTileData = tileData.find((data) => tile.type === data.type);
      if (matchingTileData === undefined) {
        console.error(
          "Couldn't find a tilesetIndex for a tile of type " + tile.type
        );
        return;
      }
      this.map.putTileAt(
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
    this.map.setCollision(collisionIndices);

    return {
      solidLayer: layer!,
    };
  }

  placeCharacters() {
    const playerPosition = tileToPixelPosition(
      testMap.playerPosition.x,
      testMap.playerPosition.y
    );
    this.player = new Player(
      this,
      playerPosition.x,
      playerPosition.y,
      this.cursors!
    );
    this.player.setCollideWorldBounds(true);

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
      player: this.player!,
      enemies,
    };
  }
}
