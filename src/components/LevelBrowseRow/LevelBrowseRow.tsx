import { Link } from "react-router-dom";
import { FetchedLevelResult } from "../../../platformer-creator-game-shared/typesFetched";

type LevelBrowseRowProps = {
  fetchedLevel: FetchedLevelResult;
};

export function LevelBrowseRow({
  fetchedLevel: {
    id,
    dateCreated,
    dateUpdated,
    description,
    title,
    averageRating,
    totalCompletions,
    user,
    userId,
    totalRatings,
  },
}: LevelBrowseRowProps) {
  return (
    <div>
      <h4>
        <Link to={`/game/${id}`}>{title}</Link>
      </h4>
      <div>{description}</div>
      <div>
        Created by <Link to={`/user/${userId}`}>{user.username}</Link>
      </div>
      <div>Published: {new Date(dateCreated).toLocaleDateString()}</div>
      <div>Updated: {new Date(dateUpdated).toLocaleDateString()}</div>
      <div>
        {totalRatings > 0
          ? `Average rating: ${averageRating}/10`
          : "No ratings yet"}
      </div>
      <div>Completed {totalCompletions} times</div>
    </div>
  );
}
