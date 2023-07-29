// import { getDataFromAuthForm } from "../../utility"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitAuthForm } from "../../utility";
import { useAuth } from "../AuthProvider";

export function CreateAccount() {
  const [error, setError] = useState(null as string | null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  //TODO: Add a check for password strength
  function clickCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    submitAuthForm(e, setError, navigate, setUser, true);
  }

  //TODO: Add field for confirming password
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
