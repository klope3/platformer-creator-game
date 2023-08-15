import { Character } from "./Character";
import { Enemy } from "./Enemy";
import { Pickup } from "./Pickup";
import { Player } from "./Player";
import { killEnemyPointReward, tileSize } from "./constants";
import { GameScene } from "./scenes/GameScene";

export function playerOverlapEnemy(
  player: Character,
  enemy: Character,
  playerEnemyOverlap: Phaser.Physics.Arcade.Collider,
  playerWorldCollider: Phaser.Physics.Arcade.Collider,
  gameScene: GameScene
) {
  const playerY = player.getCenter().y!;
  const enemyY = enemy.getCenter().y!;
  const deltaY = enemyY - playerY;
  const landedOnTop = deltaY >= tileSize / 2;
  if (landedOnTop) {
    (player as Player).forceJump();
    gameScene.enemies?.remove(enemy);
    gameScene.addPoints(killEnemyPointReward);
    enemy.die();
  } else {
    gameScene.setStartedPlaying(false);
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
        gameScene.doGameOver();
      } else {
        gameScene.scene.restart();
      }
    }, 3000);
  }
}

export function playerOverlapPickup(
  _: Player,
  pickup: Pickup,
  gameScene: GameScene
) {
  gameScene.addPoints(100);
  pickup.destroy();
}
