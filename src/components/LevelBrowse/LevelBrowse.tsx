import { useAuth } from "../AuthContext";

export function LevelBrowse() {
  const { user, setUser } = useAuth();

  return (
    <div>
      <div>{user ? `Browsing as ${user.username}` : "Not logged in"}</div>
    </div>
  );
}
