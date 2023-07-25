import { Link, useParams } from "react-router-dom";
import Phaser from "phaser";
import { useEffect } from "react";
import { gameHeight, gameWidth, gravity } from "./game/constants";
import { GameScene } from "./game/scenes/GameScene";
import { UIScene } from "./game/scenes/UIScene";
import { GameOverScene } from "./game/scenes/GameOverScene";
import { VictoryScene } from "./game/scenes/VictoryScene";
import { LoadingScene } from "./game/scenes/LoadingScene";

export let gameLevelId = 0;

export function Game() {
  const { levelId } = useParams();

  useEffect(() => {
    if (levelId && !isNaN(+levelId)) gameLevelId = +levelId;
    else console.error("Invalid level id: " + levelId);

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
      scene: [LoadingScene, GameScene, UIScene, GameOverScene, VictoryScene],
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
