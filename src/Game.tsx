import { Link, useParams } from "react-router-dom";
import Phaser from "phaser";
import { useEffect, useState } from "react";
import { gameHeight, gameWidth, gravity } from "./game/constants";
import { GameScene } from "./game/scenes/GameScene";
import { UIScene } from "./game/scenes/UIScene";
import { GameOverScene } from "./game/scenes/GameOverScene";
import { VictoryScene } from "./game/scenes/VictoryScene";
import { FetchedLevelData } from "../platformer-creator-game-shared/types";
import { fetchLevel, postLevelCompletion } from "./fetch";

//? Some unusual techniques are used to allow Phaser and React to share data. See bottom component for info.
let initializingStarted = false;

export function Game() {
  const { levelId } = useParams();
  const [fetchedLevel, setFetchedLevel] = useState(
    null as FetchedLevelData | null
  );
  //TODO: Keep an array of completions in state to show the user their previous completions of this level

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

      const level = await fetchLevel(+levelId);
      setFetchedLevel(level);

      new Phaser.Game({
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
              fetchedLevel: level,
              levelCompleteCb: handleLevelCompletion,
            });
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLevelCompletion(levelId: number, timeMs: number) {
    try {
      //TODO: should store the new completion in state with the others
      postLevelCompletion(levelId, timeMs);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAndStart();
  }, []);

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

/*
---Starting the game
The Phaser game instance lives inside the "Game" React component. It's created when the component first mounts. But React always mounts components twice, so we need to stop the game from initializing twice. To further complicate matters, a fetch call getting level data from the DB must be resolved before the game is initialized; this data needs to be used both in the React UI and in the game itself; and when the player wins (which the game itself must report), we need to use this data in another fetch call to post data about the level completion.

Here's what happens when the game starts:
1) Game component mounts
2) useEffect is called, which in turn calls fetchAndStart
3) fetchAndStart initiates the fetch call and sets initializingStarted to true
4) React unmounts and remounts the component
5) useEffect calls fetchAndStart again, which exits immediately because intializingStarted is true. This prevents a second async fetchAndStart from executing alongside the first one.
6) The first fetchAndStart resolves, and the response is parsed.
7) Assuming no errors, the game is initialized. To allow the game to build the level from the fetched data, we use the game's preboot callback to add the data to the game registry. We also add a callback to the registry, to be called when the level is completed.
8) The player can start playing.

This complicated sequence is not ideal, and in fact, it breaks the React rule of keeping components pure (by relying on and changing the external initializingStarted variable). But the learning resources available for using Phaser and React together are very limited, and adding data fetching into the mix makes the use case even more niche. This is simply the solution I was able to come up with in the absence of better/best practices relevant to the situation.
 */
