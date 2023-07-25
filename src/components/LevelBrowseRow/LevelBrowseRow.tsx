import { FetchedLevelResult } from "../../types";

type LevelBrowseRowProps = {
  fetchedLevel: FetchedLevelResult;
};

export function LevelBrowseRow({
  fetchedLevel: {
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
      <h4>{title}</h4>
      <div>{description}</div>
      <div>Created by {user.username}</div>
      <div>Published: {new Date(dateCreated).toLocaleDateString()}</div>
      <div>Updated: {new Date(dateUpdated).toLocaleDateString()}</div>
      <div>Average Rating: {averageRating}/10</div>
      <div>This level has been completed {totalCompletions} times.</div>
    </div>
  );
}
