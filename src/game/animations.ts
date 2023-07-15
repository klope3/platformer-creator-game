import { textureKeys } from "./textureData";

export const animationKeys = {
  playerMove: "playerMove",
  playerIdle: "playerIdle",
  playerJumping: "playerJumping",
  playerDie: "playerDie",
  enemyMove: "enemyMove",
  enemyIdle: "enemyIdle",
  enemyDie: "enemyDie",
  pointPickupIdle: "pointPickupIdle",
};

export function initAnimations(scene: Phaser.Scene) {
  const { anims } = scene;

  const animations = [
    {
      key: animationKeys.playerMove,
      frames: anims.generateFrameNumbers(textureKeys.player, {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    },
    {
      key: animationKeys.playerIdle,
      frames: [{ key: textureKeys.player, frame: 0 }],
    },
    {
      key: animationKeys.playerJumping,
      frames: [{ key: textureKeys.player, frame: 1 }],
    },
    {
      key: animationKeys.playerDie,
      frames: [{ key: textureKeys.player, frame: 6 }],
    },
    {
      key: animationKeys.enemyIdle,
      frames: [{ key: textureKeys.enemy, frame: 0 }],
    },
    {
      key: animationKeys.enemyMove,
      frames: anims.generateFrameNumbers(textureKeys.enemy, {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    },
    {
      key: animationKeys.enemyDie,
      frames: [{ key: textureKeys.enemy, frame: 6 }],
    },
    {
      key: animationKeys.pointPickupIdle,
      frames: anims.generateFrameNumbers(textureKeys.pointPickup, {
        start: 4,
        end: 7,
      }),
      frameRate: 4,
      repeat: -1,
    },
  ];
  for (const anim of animations) {
    anims.create(anim);
  }
}
