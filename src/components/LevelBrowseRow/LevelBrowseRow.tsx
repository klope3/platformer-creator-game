import { Link } from "react-router-dom";
import { FetchedLevelResult } from "../../../platformer-creator-game-shared/typesFetched";
import { abbreviateText } from "../../utility";
import { useState } from "react";
import "./LevelBrowseRow.css";

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
  const [expandedDescription, setExpandedDescription] = useState(false);
  const avgRatingOutOf5 = (averageRating / 2).toFixed(2);
  const abbrevText = abbreviateText(description, 30);

  return (
    <div className="level-browse-row bump-sm">
      <Link to={`/game/${id}`} className="level-browse-row-image"></Link>
      <div className="level-browse-row-info">
        {/* <h3> */}
        <Link to={`/game/${id}`}>
          <h3>{title}</h3>
        </Link>
        {/* </h3> */}
        <div
          className="level-browse-row-description"
          onClick={() => setExpandedDescription(!expandedDescription)}
        >
          {expandedDescription ? description : abbrevText}
        </div>
        <div>
          Created by{" "}
          <Link className="user-link" to={`/user/${userId}`}>
            {user.username}
          </Link>
        </div>
        <div>Published: {new Date(dateCreated).toLocaleDateString()}</div>
        <div>Updated: {new Date(dateUpdated).toLocaleDateString()}</div>
        <div>
          {totalRatings > 0
            ? `Average rating: ${avgRatingOutOf5}/5`
            : "No ratings yet"}
        </div>
        <div>Completed {totalCompletions} times</div>
      </div>
    </div>
  );
}
