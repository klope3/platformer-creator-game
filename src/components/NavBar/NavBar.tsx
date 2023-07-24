import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export function NavBar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <nav>
      {user && user.username}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
          if (setUser) setUser(null);
        }}
      >
        Log Out
      </button>
    </nav>
  );
}
