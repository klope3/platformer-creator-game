import { Character } from "./Character";
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
  private _enemies?: Phaser.Physics.Arcade.Group;
  private _lives = 3;

  public get lives(): number {
    return this._lives;
  }

  public get enemies() {
    return this._enemies;
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

    const playerEnemyOverlapCollider = this.physics.add.overlap(
      player,
      enemies,
      (player, enemy) => {
        playerOverlapEnemy(
          player as Character,
          enemy as Character,
          playerEnemyOverlapCollider,
          playerWorldCollider,
          this
        );
      }
    );
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

    this._enemies = this.physics.add.group();
    for (const character of testMap.characters) {
      const position = tileToPixelPosition(
        character.position.x,
        character.position.y
      );
      const newCharacter = new Enemy(this, position.x, position.y);
      newCharacter.setCollideWorldBounds(true);
      this._enemies.add(newCharacter);
    }

    return {
      player: this._player!,
      enemies: this._enemies!,
    };
  }

  addLives(amount: number) {
    this._lives += amount;
    this.events.emit("onChangeLives");
  }
}

function playerOverlapEnemy(
  player: Character,
  enemy: Character,
  playerEnemyOverlap: Phaser.Physics.Arcade.Collider,
  playerWorldCollider: Phaser.Physics.Arcade.Collider,
  gameScene: GameScene
) {
  const playerY = player.getCenter().y!;
  const enemyY = enemy.getCenter().y!;
  const deltaY = enemyY - playerY;
  if (deltaY >= tileSize / 2) {
    (player as Player).forceJump();
    gameScene.enemies?.remove(enemy);
    enemy.die();
  } else {
    playerEnemyOverlap.destroy();

    (player as Player).playerDeath(playerWorldCollider);
    gameScene.addLives(-1);
    const enemies = gameScene.enemies!;
    for (const enemy of enemies.children.entries) {
      (enemy as Enemy).setFrozen(true);
    }
    setTimeout(() => {
      if (gameScene.lives === 0) {
        doGameOver(gameScene);
      } else {
        gameScene.scene.restart();
      }
    }, 3000);
  }
}

function doGameOver(gameScene: Phaser.Scene) {
  gameScene.scene.stop();
  gameScene.scene.launch("game-over-scene");
}
