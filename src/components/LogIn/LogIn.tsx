import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { submitAuthForm } from "../../utility";

export function LogIn() {
  const [error, setError] = useState(null as string | null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  function clickLogIn(e: React.FormEvent<HTMLFormElement>) {
    submitAuthForm(e, setError, navigate, setUser);
  }

  useEffect(() => {
    if (user) navigate("/browse");
  }, [user]);

  return (
    <>
      <form className="auth-form" onSubmit={clickLogIn}>
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
