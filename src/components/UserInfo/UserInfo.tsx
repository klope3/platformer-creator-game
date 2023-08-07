import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUser as fetchDbUser } from "../../fetch";
import { User } from "../../../platformer-creator-game-shared/typesFetched";
import { useAuth } from "../AuthProvider";

export function UserInfo() {
  const { user: loggedUser } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState(null as User | null);

  async function fetchUser() {
    try {
      const fetchedUser = await fetchDbUser(userId ? +userId : 0);
      setUser(fetchedUser);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <>
      {user && (
        <div key={userId}>
          <div>{user.email}</div>
          <div>{user.username}</div>
          <div>
            You are{" "}
            {loggedUser && loggedUser.username === user.username ? "" : "NOT"}{" "}
            logged in as this user.
          </div>
        </div>
      )}
    </>
  );
}
