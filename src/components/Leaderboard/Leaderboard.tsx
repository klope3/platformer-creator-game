import { LevelCompletion } from "../../../platformer-creator-game-shared/typesFetched";
import { fetchLevelCompletions } from "../../fetch";
import "./Leaderboard.css";
import { useState, useEffect } from "react";

type LeaderboardProps = {
  levelId: number;
  closeModalCb: () => void;
};

export function Leaderboard({ closeModalCb, levelId }: LeaderboardProps) {
  const [completions, setCompletions] = useState(
    null as LevelCompletion[] | null
  );
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    fetchLevelCompletions(levelId)
      .then((res) => setCompletions(res))
      .catch((_) => setError("Couldn't get high score data."));
  }, []);

  if (completions) {
    completions.sort((a, b) => a.gameDuration - b.gameDuration);
  }

  return (
    <div className="modal-bg">
      <div className="modal-parent">
        <div className="leaderboard-modal">
          {completions && (
            <table>
              <caption>HIGH SCORES</caption>
              <tbody>
                <tr>
                  <th>Username</th>
                  <th>Time</th>
                </tr>
                {completions.map((completion) => (
                  <tr>
                    <td>{completion.user.username}</td>
                    <td>{`${(completion.gameDuration / 1000).toFixed(2)}s`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!completions && !error && <div>Loading...</div>}
          <button className="modal-x leaderboard-x" onClick={closeModalCb}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}
