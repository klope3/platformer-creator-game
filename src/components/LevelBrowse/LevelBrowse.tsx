import { useEffect, useState } from "react";
import { FetchedLevelResult } from "../../types";
import { parseLevelSearchResultsJson } from "../../validations";
import { LevelBrowseRow } from "../LevelBrowseRow/LevelBrowseRow";

export function LevelBrowse() {
  const [searchResults, setSearchResults] = useState(
    [] as FetchedLevelResult[]
  );
  const [isLoading, setIsLoading] = useState(true);

  async function getResults() {
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        "http://localhost:3000/levels",
        requestOptions
      );
      if (!response.ok) {
        return;
      }
      const json = await response.json();
      const resultsParsed = parseLevelSearchResultsJson(json);
      setSearchResults(resultsParsed);
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
