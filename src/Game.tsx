import { Link } from "react-router-dom";
import Phaser from "phaser";
import { MyScene } from "./game/MyScene";
import { useEffect } from "react";

export function Game() {
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "game-container",
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 2000 },
          debug: true,
        },
      },
      pixelArt: true,
      scene: [MyScene],
    });
    return () => {
      game.destroy(true, false);
    };
  }, []);

  return (
    <>
      <Link to="/">Home</Link>
      <div style={{ width: 800, height: 600, overflow: "hidden" }}>
        <div id="game-container"></div>
      </div>
    </>
  );
}
