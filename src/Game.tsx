import { Link, useParams } from "react-router-dom";
import Phaser from "phaser";
import { useEffect, useState } from "react";
import { gameHeight, gameWidth, gravity } from "./game/constants";
import { GameScene } from "./game/scenes/GameScene";
import { UIScene } from "./game/scenes/UIScene";
import { GameOverScene } from "./game/scenes/GameOverScene";
import { VictoryScene } from "./game/scenes/VictoryScene";
import { FetchedLevelData, fetchedLevelDataSchema } from "./types";

//the async fetchAndStart is called when Game first mounts, but React will always remount it a second time.
//this variable stops another fetch from starting if one has already started.
let initializingStarted = false;

export function Game() {
  const { levelId } = useParams();
  const [fetchedLevel, setFetchedLevel] = useState(
    null as FetchedLevelData | null
  );

  async function fetchAndStart() {
    if (initializingStarted) {
      //set the variable back to false so we can start initialization next time component mounts
      initializingStarted = false;
      return;
    }
    initializingStarted = true;
    try {
      if (!levelId || isNaN(+levelId))
        throw new Error("Invalid level id " + levelId);

      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        `http://localhost:3000/levels/${+levelId}`,
        requestOptions
      );

      const json = await response.json();
      const parsedData = fetchedLevelDataSchema.parse(json);
      setFetchedLevel(parsedData);

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
        scene: [GameScene, UIScene, GameOverScene, VictoryScene],
        callbacks: {
          preBoot: (game: Phaser.Game) => {
            game.registry.merge({
              fetchedLevel: parsedData,
            });
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAndStart();
  }, []);

  //TODO: the user should be able to go to site.com/play/:levelId to play a specific level id. React Router useParams with nested routes might be the way to go here. https://reactrouter.com/en/main/hooks/use-params
  return (
    <>
      <Link to="/">Home</Link>
      <div style={{ width: gameWidth, height: gameHeight, overflow: "hidden" }}>
        <div id="game-container"></div>
      </div>
      {fetchedLevel && (
        <div>
          {fetchedLevel.title}
          <div>
            Created by{" "}
            <Link to={`/user/${fetchedLevel.userId}`}>
              {fetchedLevel.user.username}
            </Link>
          </div>
          <div>
            Created on:{" "}
            {new Date(fetchedLevel.dateCreated).toLocaleDateString()}
          </div>
          <div>
            Last updated:{" "}
            {new Date(fetchedLevel.dateUpdated).toLocaleDateString()}
          </div>
        </div>
      )}
    </>
  );
}
