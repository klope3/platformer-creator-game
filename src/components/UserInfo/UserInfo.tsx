import { useParams } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useEffect, useState } from "react";
import { User, userSchema } from "../../types";

export function UserInfo() {
  const { user: loggedUser } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState(null as User | null);

  async function fetchUser() {
    try {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        `http://localhost:3000/users/${userId ? +userId : 0}`,
        requestOptions
      );
      const json = await response.json();
      const parsedUser = userSchema.parse(json);
      setUser(parsedUser);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {user && (
        <>
          <div>{user.email}</div>
          <div>{user.username}</div>
          <div>
            You are{" "}
            {loggedUser && loggedUser.username === user.username ? "" : "NOT"}{" "}
            logged in as this user.
          </div>
        </>
      )}
    </>
  );
}
