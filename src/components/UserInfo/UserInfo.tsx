import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUser as fetchDbUser } from "../../fetch";
import { User } from "../../../platformer-creator-game-shared/typesFetched";
import { useAuth } from "../AuthProvider";
import "./UserInfo.css";

export function UserInfo() {
  const { user: loggedUser } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState(null as User | null);
  const [error, setError] = useState(null as string | null);

  async function fetchUser() {
    try {
      const fetchedUser = await fetchDbUser(userId ? +userId : 0);
      setUser(fetchedUser);
    } catch (error) {
      setError("Sorry, we couldn't find that user.");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <>
      {user && (
        <div key={userId} className="user-info bump-sm">
          <div
            className="user-profile-image"
            style={{ backgroundImage: "url('/assets/profile_icon.png" }} //this could eventually be an actual profile pic
          ></div>
          <div className="user-info-primary">
            <h2>{user.username}</h2>
            <div>{user.email}</div>
            <div>
              Member since {new Date(user.joinDate).toLocaleDateString()}
            </div>
            <div>
              You are{" "}
              {loggedUser && loggedUser.username === user.username ? "" : "NOT"}{" "}
              logged in as this user.
            </div>
          </div>
        </div>
      )}
      {error && <div>{error}</div>}
    </>
  );
}
