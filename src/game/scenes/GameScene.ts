// import { fetchedLevelDataSchema } from "../../types";
import { parseLevelCompletionCallback } from "../../validations";
import { Character } from "../Character";
import { Enemy } from "../Enemy";
import { Pickup } from "../Pickup";
import { Player } from "../Player";
import { initAnimations } from "../animations";
import {
  eventNames,
  gameHeight,
  gameWidth,
  levelHeight,
  levelWidth,
  sceneNames,
  tileSize,
} from "../constants";
import { playerOverlapEnemy, playerOverlapPickup } from "../interactions";
import { textureData, textureKeys } from "../textureData";
import { tileData } from "../tiles";
import { Level, Vector2 } from "../types";
import { convertFetchedLevel, tileToPixelPosition } from "../utility";

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
  private _timeMs = 0;
  private _startedPlaying = false; //used to start the timer only after the first input.

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

  public get timeMs() {
    return this._timeMs;
  }

  public get levelId() {
    return this._level?.id;
  }

  constructor() {
    super(sceneNames.gameScene);
  }

  preload() {
    for (const data of textureData) {
      if (data.type !== "sheet") {
        this.load.image(data.key, data.path);
        continue;
      }
      if (data.frameWidth === undefined || data.frameHeight === undefined)
        console.error("Bad sprite sheet data!");
      this.load.spritesheet(data.key, data.path, {
        frameWidth: data.frameWidth!,
        frameHeight: data.frameHeight,
      });
    }
  }

  create() {
    initAnimations(this);
    this._cursors = this.input.keyboard?.createCursorKeys();
    this._timeMs = 0; //reset the timer to 0 when the scene restarts due to lost life
    this._level = convertFetchedLevel(this.game.registry.get("fetchedLevel"));

    const buildMapResult = this.buildMap();
    if (!buildMapResult) return;
    const { solidLayer } = buildMapResult;

    const placeCharactersResult = this.placeCharacters();
    if (!placeCharactersResult) return;
    const { player, enemies } = placeCharactersResult;
    this.setupCamera(player);
    this.placePickups();
    this.setupColliders(player, enemies, solidLayer);
  }

  update(_: number, delta: number): void {
    if (this._startedPlaying) this._timeMs += delta;
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
    //find matching data and place all tiles in the map
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
    //place the goal, which is actually two tall (so a bottom and a top part)
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

  setupCamera(player: Player) {
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
  }

  placePickups() {
    const level = this._level;
    if (!level) return;

    this._pickups = this.physics.add.group();
    for (const pickup of level.pickups) {
      const { x, y } = pickup.position;
      const { x: pixelX, y: pixelY } = tileToPixelPosition(x, y);
      const newPickup = new Pickup(this, pixelX, pixelY);
      this._pickups.add(newPickup);
      (newPickup.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }
  }

  placeCharacters() {
    const level = this._level;
    if (!level) return;

    const { x: playerX, y: playerY } = level.playerPosition;
    const playerPixelPosition = tileToPixelPosition(playerX, playerY);
    this._player = new Player(
      this,
      playerPixelPosition.x,
      playerPixelPosition.y,
      this._cursors!
    );
    this._player.setCollideWorldBounds(true);

    this._enemies = this.physics.add.group();
    for (const character of level.characters) {
      const { x, y } = character.position;
      const { x: pixelX, y: pixelY } = tileToPixelPosition(x, y);
      const newCharacter = new Enemy(this, pixelX, pixelY);
      newCharacter.setCollideWorldBounds(true);
      this._enemies.add(newCharacter);
    }

    return {
      player: this._player!,
      enemies: this._enemies!,
    };
  }

  setupColliders(
    player: Player,
    enemies: Phaser.Physics.Arcade.Group,
    solidLayer: Phaser.Tilemaps.TilemapLayer
  ) {
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

  addLives(amount: number) {
    this._lives += amount;
    this.events.emit(eventNames.onChangeLives);
  }

  addPoints(amount: number) {
    this._points += amount;
    if (this._points < 0) this._points = 0;
    this.events.emit(eventNames.onChangePoints);
  }

  setStartedPlaying(value: boolean) {
    this._startedPlaying = value;
  }

  setVictory(value: boolean) {
    this._victory = value;
    if (value) this._startedPlaying = false;
  }

  doGameOver() {
    this.scene.stop();
    this.scene.launch(sceneNames.gameOverScene);
  }

  doGameWin() {
    this.setVictory(true);
    this.scene.launch(sceneNames.victoryScene);
    this.scene.pause();

    try {
      const levelCompleteCb = this.game.registry.get("levelCompleteCb");
      const parsedCb = parseLevelCompletionCallback(levelCompleteCb);
      const levelId = this.levelId!; //we could never have reached doGameWin if the level was undefined
      parsedCb(levelId, this._timeMs);
    } catch (error) {
      console.error(
        "There was something wrong with the level completion callback."
      );
    }
  }
}
