import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoginResult } from "../../fetch";
import { useAuth } from "../AuthProvider";

export function LogIn() {
  const [error, setError] = useState(null as string | null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  function clickLogIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const email = data.get("email");
    const password = data.get("password");
    if (!(typeof email === "string") || !(typeof password === "string")) {
      setError("Invalid credentials.");
      return;
    }

    getLoginResult(email, password).then((result) => {
      const { data, errorMessage } = result;
      if (data && setUser) {
        setUser({
          email: data.email,
          username: data.username,
        });
        localStorage.setItem("token", data.token);
        navigate("/browse");
      } else if (errorMessage) {
        setError(errorMessage);
      }
    });
  }

  useEffect(() => {
    if (user) navigate("/browse");
  }, [user]);

  return (
    <>
      <form onSubmit={clickLogIn}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Log In</button>
      </form>
    </>
  );
}
