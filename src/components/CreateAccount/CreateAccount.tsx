// import { getDataFromAuthForm } from "../../utility"
import { useState } from "react";
import { getDataFromAuthForm, getIdFromJwtToken } from "../../utility";
import { getCreateAccountResult } from "../../fetch";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

export function CreateAccount() {
  const [error, setError] = useState(null as string | null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  //TODO: This should be merged with the clickLogin function in some way.
  function clickCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { username, email, password } = getDataFromAuthForm(
      e.target as HTMLFormElement
    );
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      setError("Invalid input.");
      return;
    }

    getCreateAccountResult(username, email, password).then((result) => {
      const { data, errorMessage } = result;
      if (data && setUser) {
        const id = getIdFromJwtToken(data.token);
        setUser({
          id,
          username: data.username,
          email: data.email,
        });
        localStorage.setItem("token", data.token);
        navigate("/browse");
      } else if (errorMessage) {
        setError(errorMessage);
      }
    });
  }

  return (
    <>
      <form onSubmit={clickCreateAccount}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </>
  );
}
