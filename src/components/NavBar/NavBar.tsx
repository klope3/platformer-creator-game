import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import "./NavBar.css";

export function NavBar() {
  const { user, setUser } = useAuth();
  // const navigate = useNavigate();

  return (
    <nav>
      <ul>
        <li>
          <Link className="bump-sm" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="bump-sm" to="/browse">
            Browse Levels
          </Link>
        </li>
      </ul>
      <ul>
        {!user && (
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
          <>
            <li className="nav-welcome-text">Welcome, {user.username}</li>
            <li>
              <Link className="bump-sm" to={`/user/${user.id}`}>
                My Account
              </Link>
            </li>
            <li>
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
