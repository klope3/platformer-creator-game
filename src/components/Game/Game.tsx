import { Link, useParams } from "react-router-dom";
import Phaser from "phaser";
import { useEffect, useState } from "react";
import { gameHeight, gameWidth, gravity } from "../../game/constants";
import { GameScene } from "../../game/scenes/GameScene";
import { UIScene } from "../../game/scenes/UIScene";
import { GameOverScene } from "../../game/scenes/GameOverScene";
import { VictoryScene } from "../../game/scenes/VictoryScene";
import { FetchedLevelData } from "../../../platformer-creator-game-shared/typesFetched";
import {
  fetchLevel,
  fetchRating,
  postLevelCompletion,
  postRating,
  updateRating,
} from "../../fetch";
import { StarRating } from "../StarRating/StarRating";
import { useAuth } from "../AuthProvider";
import { Leaderboard } from "../Leaderboard/Leaderboard";
import "./Game.css";
import { abbreviateText } from "../../utility";

let game: Phaser.Game | null;

export function Game() {
  const { levelId } = useParams();
  const [fetchedLevel, setFetchedLevel] = useState(
    null as FetchedLevelData | null
  );
  const [rating, setRating] = useState(null as number | null);
  const { user } = useAuth();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  async function fetchLevelStartGame() {
    try {
      if (!levelId || isNaN(+levelId))
        throw new Error("Invalid level id " + levelId);

      const level = await fetchLevel(+levelId);
      setFetchedLevel(level);

      game = new Phaser.Game({
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

  async function tryFetchRating() {
    const token = localStorage.getItem("token");
    if (!user || !token || !levelId) return;

    const ratingValue = await fetchRating(user.id, +levelId, token);
    if (ratingValue !== undefined) setRating(ratingValue);
  }

  async function handleLevelCompletion(
    levelId: number,
    timeMs: number,
    lives: number,
    score: number
  ) {
    try {
      postLevelCompletion(levelId, timeMs, lives, score);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleClickRating(clickedRating: number) {
    const ratingFetchFn = rating !== null ? updateRating : postRating;
    const token = localStorage.getItem("token");
    const ratingToSubmit = clickedRating * 2; //ratings are stored in db as ints, so 5 = 10, 4.5 = 9, etc.
    if (!user || !levelId || !token) return;
    const ratingResult = await ratingFetchFn(
      user.id,
      +levelId,
      token,
      ratingToSubmit
    );
    if (!ratingResult) return;
    setRating(ratingResult.value);
  }

  useEffect(() => {
    fetchLevelStartGame();
    return () => {
      if (game) {
        game.destroy(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    tryFetchRating();
  }, [user]);

  const avgRatingOutOf5 =
    fetchedLevel && (fetchedLevel.averageRating / 2).toFixed(2);
  return (
    <>
      <div style={{ width: gameWidth, height: gameHeight, overflow: "hidden" }}>
        <div id="game-container"></div>
      </div>
      {fetchedLevel && (
        <div className="game-info-section">
          <div className="game-info-primary">
            <div className="game-info-header">
              <div className="game-title">
                <h2>{fetchedLevel.title}</h2>
              </div>
              <div className="game-completion-count">
                🎮 Completed {fetchedLevel.totalCompletions} times
              </div>
            </div>
            <div>
              Created by{" "}
              <Link className="user-link" to={`/user/${fetchedLevel.userId}`}>
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
            <div
              className="game-description indent-sm"
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            >
              {descriptionExpanded
                ? fetchedLevel.description
                : abbreviateText(fetchedLevel.description)}
            </div>
          </div>
          <div className="game-info-secondary">
            {!user && (
              <div className="danger game-login-warning">
                You are not logged in. Your play information won't be recorded.
              </div>
            )}
            {user && (
              <StarRating
                heightPx={40}
                onClick={handleClickRating}
                rating={rating !== null ? rating : 0}
              />
            )}
            <div>
              {fetchedLevel.totalRatings > 0
                ? `Average rating: ${avgRatingOutOf5}/5`
                : "No ratings yet"}
            </div>
            <button onClick={() => setShowLeaderboard(true)}>
              High Scores
            </button>
          </div>
        </div>
      )}
      {showLeaderboard && levelId && (
        <Leaderboard
          closeModalCb={() => setShowLeaderboard(false)}
          levelId={+levelId}
        />
      )}
    </>
  );
}
