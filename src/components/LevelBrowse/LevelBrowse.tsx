import { useEffect, useState } from "react";
import { fetchLevelResults } from "../../fetch";
import { FetchedLevelResult } from "../../../platformer-creator-game-shared/typesFetched";
import { LevelBrowseRow } from "../LevelBrowseRow/LevelBrowseRow";

export function LevelBrowse() {
  const [searchResults, setSearchResults] = useState(
    [] as FetchedLevelResult[]
  );
  const [isLoading, setIsLoading] = useState(true);

  async function getResults() {
    try {
      const results = await fetchLevelResults();
      if (results) setSearchResults(results);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getResults();
  }, []);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {!isLoading &&
        searchResults.map((result) => <LevelBrowseRow fetchedLevel={result} />)}
    </div>
  );
}
