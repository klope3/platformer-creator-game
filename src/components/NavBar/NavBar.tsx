import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export function NavBar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/browse">Browse Games</Link>
        </li>
        {!user && (
          <>
            <li>
              <Link to="/createAccount">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Log In</Link>
            </li>
          </>
        )}
        {user && (
          <li>
            <Link to={`/user/${user.id}`}>My Account</Link>
          </li>
        )}
        {user && (
          <li>
            Welcome, {user.username}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
                if (setUser) setUser(null);
              }}
            >
              Log Out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
