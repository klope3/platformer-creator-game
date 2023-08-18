import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import "./NavBar.css";

export function NavBar() {
  const { user, setUser } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link
            className="portal"
            style={{ backgroundImage: "url('/assets/k_logo.png')" }}
            to="/"
          ></Link>
        </li>
        <li>
          <Link className="bump-sm nav-link" to="/browse">
            Browse Levels
          </Link>
        </li>
      </ul>
      <ul>
        {!user && (
          <>
            <li>
              <Link className="bump-sm nav-link" to="/createAccount">
                Sign Up
              </Link>
            </li>
            <li>
              <Link className="bump-sm nav-link" to="/login">
                Log In
              </Link>
            </li>
          </>
        )}
        {user && (
          <>
            <li className="nav-welcome-text">Welcome, {user.username}</li>
            <li>
              <Link className="bump-sm nav-link" to={`/user/${user.id}`}>
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="bump-sm nav-link"
                onClick={() => {
                  localStorage.removeItem("token");
                  // navigate("/login");
                  if (setUser) setUser(null);
                }}
              >
                Log Out
              </Link>
            </li>
          </>
        )}
      </ul>
      {/* {!user && (
          <>
            <li>
              <Link className="bump-sm" to="/createAccount">
                Sign Up
              </Link>
            </li>
            <li>
              <Link className="bump-sm" to="/login">
                Log In
              </Link>
            </li>
          </>
        )}
        {user && (
          <li>
            <Link className="bump-sm" to={`/user/${user.id}`}>
              My Account
            </Link>
          </li>
        )}
        {user && (
          <li>
            Welcome, {user.username}
            <Link
              to="/login"
              className="bump-sm"
              onClick={() => {
                localStorage.removeItem("token");
                // navigate("/login");
                if (setUser) setUser(null);
              }}
            >
              Log Out
            </Link>
          </li>
        )} */}
    </nav>
  );
}
