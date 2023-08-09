import jwtDecode from "jwt-decode";
import {
  fetchedLevelDataSchema,
  ratingSchema,
  userSchema,
} from "../platformer-creator-game-shared/typesFetched";
import { serverUrl } from "./utility";
import {
  parseAuthJson,
  parseLevelCompletions,
  parseLevelSearchResultsJson,
  parseObjWithId,
} from "./validations";

type AuthFetchResult = {
  data?: {
    token: string;
    username: string;
    email: string;
  };
  errorMessage?: string;
};

const unknownError = "Something went wrong. Try again later.";

function createAuthHeaders(token: string, includeHeaderForPosting = false) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  if (includeHeaderForPosting)
    headers.append("Content-Type", "application/json");
  return headers;
}

export async function getAuthResult(
  email: string,
  password: string,
  username: string,
  endpoint: "login" | "users"
): Promise<AuthFetchResult> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email,
    password,
    username,
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
  };

  try {
    const response = await fetch(`${serverUrl()}/${endpoint}`, requestOptions);
    const json = await response.json();

    if (!response.ok) {
      return {
        errorMessage: json.message || unknownError,
      };
    }

    const parsed = parseAuthJson(json);
    return {
      data: parsed,
    };
  } catch (error) {
    return {
      errorMessage: unknownError,
    };
  }
}

export async function fetchUser(userId: number) {
  const requestOptions = {
    method: "GET",
  };
  const response = await fetch(
    `${serverUrl()}/users/${userId}`,
    requestOptions
  );
  const json = await response.json();
  return userSchema.parse(json);
}

export async function fetchLevel(levelId: number) {
  const requestOptions = {
    method: "GET",
  };
  const response = await fetch(
    `${serverUrl()}/levels/${+levelId}`,
    requestOptions
  );

  const json = await response.json();
  return fetchedLevelDataSchema.parse(json);
}

export async function fetchLevelResults() {
  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(`${serverUrl()}/levels`, requestOptions);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const json = await response.json();
  return parseLevelSearchResultsJson(json);
}

export async function postLevelCompletion(levelId: number, timeMs: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Couldn't post level completion, due to a missing token.");
    return;
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token}`);

  const decoded = jwtDecode(token);
  const parsed = parseObjWithId(decoded);

  const raw = JSON.stringify({
    userId: parsed.id,
    levelId: levelId,
    completionTime: Math.round(timeMs),
  });

  const redirect: RequestRedirect = "follow";

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect,
  };

  const response = await fetch(
    `${serverUrl()}/levels/completions`,
    requestOptions
  );
  const json = await response.json();

  if (!response.ok) {
    if (json.message) throw new Error(json.message);
    else {
      throw new Error(json);
    }
  }

  return json;
}

export async function fetchLevelCompletions(levelId: number) {
  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(
    `${serverUrl()}/levels/${levelId}/completions`,
    requestOptions
  );
  const json = await response.json();
  const parsed = parseLevelCompletions(json);

  return parsed;
}

export async function fetchRating(
  userId: number,
  levelId: number,
  token: string
) {
  const headers = createAuthHeaders(token);
  const requestOptions = {
    method: "GET",
    headers,
  };
  const response = await fetch(
    `${serverUrl()}/users/${userId}/ratings/${levelId}`,
    requestOptions
  );
  if (!response.ok) return undefined;
  const json = await response.json();
  const parsed = ratingSchema.parse(json);
  parsed.value /= 2; //ratings are stored in db as ints, so 5 = 10, 4.5 = 9, etc.
  return parsed.value;
}

export async function postRating(
  userId: number,
  levelId: number,
  token: string,
  value: number
) {
  const headers = createAuthHeaders(token, true);
  const body = JSON.stringify({
    userId,
    levelId,
    value,
  });
  const requestOptions = {
    method: "POST",
    body,
    headers,
  };
  const response = await fetch(`${serverUrl()}/ratings`, requestOptions);
  if (!response.ok) {
    return undefined;
  }
  const json = await response.json();
  const parsed = ratingSchema.parse(json);
  parsed.value /= 2; //ratings are stored in db as ints, so 5 = 10, 4.5 = 9, etc.
  return parsed;
}

export async function updateRating(
  userId: number,
  levelId: number,
  token: string,
  value: number
) {
  const headers = createAuthHeaders(token, true);
  const body = JSON.stringify({
    value,
  });
  const requestOptions = {
    method: "PUT",
    body,
    headers,
  };
  const response = await fetch(
    `${serverUrl()}/users/${userId}/ratings/${levelId}`,
    requestOptions
  );
  if (!response.ok) {
    return undefined;
  }
  const json = await response.json();
  const parsed = ratingSchema.parse(json);
  parsed.value /= 2; //ratings are stored in db as ints, so 5 = 10, 4.5 = 9, etc.
  return parsed;
}
