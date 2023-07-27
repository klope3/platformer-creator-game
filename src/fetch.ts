import { parseAuthJson, parseMessageJson } from "./validations";

type AuthFetchResult = {
  data?: {
    token: string;
    username: string;
    email: string;
  };
  errorMessage?: string;
};

const unknownError = "Something went wrong. Try again later.";

export async function getLoginResult(
  email: string,
  password: string
): Promise<AuthFetchResult> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email,
    password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch("http://localhost:3000/login", requestOptions);

    const json = await response.json();

    if (!response.ok) {
      try {
        const parsed = parseMessageJson(json);
        return {
          errorMessage: parsed.message,
        };
      } catch (error) {
        return {
          errorMessage: unknownError,
        };
      }
    }

    try {
      const parsed = parseAuthJson(json);
      return {
        data: parsed,
      };
    } catch (error) {
      return {
        errorMessage: unknownError,
      };
    }
  } catch (error) {
    return {
      errorMessage: unknownError,
    };
  }
}

//TODO: Could login and create account functions be merged in any way?
export async function getCreateAccountResult(
  username: string,
  email: string,
  password: string
): Promise<AuthFetchResult> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username,
    email,
    password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  try {
    const response = await fetch("http://localhost:3000/users", requestOptions);

    const json = await response.json();

    if (!response.ok) {
      try {
        const parsed = parseMessageJson(json);
        return {
          errorMessage: parsed.message,
        };
      } catch (error) {
        return {
          errorMessage: unknownError,
        };
      }
    }

    try {
      const parsed = parseAuthJson(json);
      return {
        data: parsed,
      };
    } catch (error) {
      return {
        errorMessage: unknownError,
      };
    }
  } catch (error) {
    return {
      errorMessage: unknownError,
    };
  }
}
