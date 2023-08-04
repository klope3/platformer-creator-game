import jwtDecode from "jwt-decode";
import {
  fetchedLevelDataSchema,
  userSchema,
} from "../platformer-creator-game-shared/types";
import { serverUrl } from "./utility";
import {
  parseAuthJson,
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
