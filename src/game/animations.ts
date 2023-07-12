export const animationKeys = {
  move: "move",
  idle: "idle",
  jumping: "jumping",
};

export function initAnimations(scene: Phaser.Scene) {
  const { anims } = scene;

  const animations = [
    {
      key: animationKeys.move,
      frames: anims.generateFrameNumbers("tofuman", { start: 1, end: 4 }),
      frameRate: 10,
      repeat: -1,
    },
    {
      key: animationKeys.idle,
      frames: [{ key: "tofuman", frame: 0 }],
    },
    {
      key: animationKeys.jumping,
      frames: [{ key: "tofuman", frame: 1 }],
    },
  ];
  for (const anim of animations) {
    anims.create(anim);
  }
}
