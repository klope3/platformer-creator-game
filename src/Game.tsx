import { Link } from "react-router-dom";
import Phaser from "phaser";
import { useEffect } from "react";
import { gameHeight, gameWidth, gravity } from "./game/constants";
import { GameScene } from "./game/GameScene";
import { UIScene } from "./game/UIScene";
import { GameOverScene } from "./game/GameOverScene";

export function Game() {
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "game-container",
      width: gameWidth,
      height: gameHeight,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: gravity },
          debug: false,
        },
      },
      zoom: 2,
      pixelArt: true,
      scene: [GameScene, UIScene, GameOverScene],
    });
    return () => {
      game.destroy(true, false);
    };
  }, []);

  //TODO: the user should be able to go to site.com/play/:levelId to play a specific level id. React Router useParams with nested routes might be the way to go here. https://reactrouter.com/en/main/hooks/use-params
  return (
    <>
      <Link to="/">Home</Link>
      <div style={{ width: gameWidth, height: gameHeight, overflow: "hidden" }}>
        <div id="game-container"></div>
      </div>
    </>
  );
}
