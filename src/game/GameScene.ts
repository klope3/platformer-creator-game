import { Character } from "./Character";
import { Enemy } from "./Enemy";
import { Pickup } from "./Pickup";
import { Player } from "./Player";
import { initAnimations } from "./animations";
import {
  gameHeight,
  gameWidth,
  killEnemyPointReward,
  levelHeight,
  levelWidth,
  tileSize,
} from "./constants";
import { testMap } from "./testMap";
import { textureData, textureKeys } from "./textureData";
import { tileData } from "./tiles";
import { Level, Vector2 } from "./types";
import { tileToPixelPosition } from "./utility";

export class GameScene extends Phaser.Scene {
  private _player?: Player;
  private _cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private _level?: Level;
  private _tilemap?: Phaser.Tilemaps.Tilemap;
  private _enemies?: Phaser.Physics.Arcade.Group;
  private _pickups?: Phaser.Physics.Arcade.Group;
  private _lives = 3;
  private _points = 0;
  private _victory = false;

  public get lives(): number {
    return this._lives;
  }

  public get points() {
    return this._points;
  }

  public get victory() {
    return this._victory;
  }

  public get enemies() {
    return this._enemies;
  }

  public get goalPosition(): Vector2 {
    const level = this._level;
    return {
      x: level ? level.goalPosition.x : -1,
      y: level ? level.goalPosition.y : -1,
    };
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

    this._level = testMap;
    const buildMapResult = this.buildMap();
    if (!buildMapResult) return;
    const { solidLayer } = buildMapResult;

    const placeCharactersResult = this.placeCharacters();
    if (!placeCharactersResult) return;
    const { player, enemies } = placeCharactersResult;
    this.cameras.main.setBounds(
      0,
      0,
      tileSize * levelWidth * 2,
      tileSize * levelHeight * 2
    );
    this.cameras.main.startFollow(
      player,
      true,
      0.05,
      0.05,
      (-1 * gameWidth) / 4,
      (-1 * gameHeight) / 4
    );
    this.placePickups();

    const playerWorldCollider = this.physics.add.collider(player, solidLayer);
    this.physics.add.collider(enemies, solidLayer);
    this.physics.add.overlap(player, this._pickups!, (player, pickup) =>
      playerOverlapPickup(player as Player, pickup as Pickup, this)
    );

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
    this._tilemap = this.make.tilemap({
      width: levelWidth,
      height: levelHeight,
      tileWidth: tileSize,
      tileHeight: tileSize,
    });
    const tileset = this._tilemap.addTilesetImage(textureKeys.tiles);
    const goalLayer = this._tilemap.createBlankLayer("goal", tileset!);
    const solidLayer = this._tilemap.createBlankLayer("platforms", tileset!);
    const level = this._level;
    if (!level) return;
    //find matching data and place tiles
    for (const tile of level.tiles) {
      const matchingTileData = tileData.find((data) => tile.type === data.type);
      if (matchingTileData === undefined) {
        console.error(
          "Couldn't find a tilesetIndex for a tile of type " + tile.type
        );
        return;
      }
      this._tilemap.putTileAt(
        matchingTileData.tilesetIndex,
        tile.position.x,
        tile.position.y,
        true,
        solidLayer!
      );
    }
    const goalBottomData = tileData.find((data) => data.type === "goal_bottom");
    const goalTopData = tileData.find((data) => data.type === "goal_top");
    if (!goalBottomData || !goalTopData) {
      console.error("Couldn't find data for goal tile(s)");
      return;
    }
    this._tilemap.putTileAt(
      goalBottomData.tilesetIndex,
      level.goalPosition.x,
      level.goalPosition.y,
      true,
      goalLayer!
    );
    this._tilemap.putTileAt(
      goalTopData.tilesetIndex,
      level.goalPosition.x,
      level.goalPosition.y - 1,
      true,
      goalLayer!
    );
    //set collision
    const collisionIndices = tileData
      .map((data) => (data.solid ? data.tilesetIndex : -1))
      .filter((item) => item !== -1);
    this._tilemap.setCollision(collisionIndices);

    return {
      solidLayer: solidLayer!,
    };
  }

  placePickups() {
    const level = this._level;
    if (!level) return;

    this._pickups = this.physics.add.group();
    for (const pickup of level.pickups) {
      const pickupPosition = tileToPixelPosition(
        pickup.position.x,
        pickup.position.y
      );
      const newPickup = new Pickup(this, pickupPosition.x, pickupPosition.y);
      this._pickups.add(newPickup);
      (newPickup.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }
  }

  placeCharacters() {
    const level = this._level;
    if (!level) return;

    const playerPosition = tileToPixelPosition(
      level.playerPosition.x,
      level.playerPosition.y
    );
    this._player = new Player(
      this,
      playerPosition.x,
      playerPosition.y,
      this._cursors!
    );
    this._player.setCollideWorldBounds(true);

    this._enemies = this.physics.add.group();
    for (const character of level.characters) {
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

  addPoints(amount: number) {
    this._points += amount;
    if (this._points < 0) this._points = 0;
    this.events.emit("onChangePoints");
  }

  setVictory(value: boolean) {
    this._victory = value;
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
    gameScene.addPoints(killEnemyPointReward);
    enemy.die();
  } else {
    playerEnemyOverlap.destroy();

    (player as Player).playerDeath(playerWorldCollider);
    gameScene.addLives(-1);

    //? How many points, if any, should we lose for losing a life? If none, we might die on purpose just to farm enemies.

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

function playerOverlapPickup(
  player: Player,
  pickup: Pickup,
  gameScene: GameScene
) {
  gameScene.addPoints(100);
  pickup.destroy();
}

function doGameOver(gameScene: Phaser.Scene) {
  gameScene.scene.stop();
  gameScene.scene.launch("game-over-scene");
}

export function doGameWin(gameScene: GameScene) {
  gameScene.setVictory(true);
  gameScene.scene.launch("victory-scene");
  gameScene.scene.pause();
}
