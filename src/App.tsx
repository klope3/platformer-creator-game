import { Routes, Route } from "react-router";
import "./App.css";
import { Game } from "./Game";
import { Link } from "react-router-dom";
import { LogIn } from "./components/LogIn/LogIn";
import { LevelBrowse } from "./components/LevelBrowse/LevelBrowse";
import { AuthProvider } from "./components/AuthProvider";
import { NavBar } from "./components/NavBar/NavBar";
import { UserInfo } from "./components/UserInfo/UserInfo";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {/* <Link to="/game">Game</Link> */}
              <Link to="/login">Log In</Link>
            </div>
          }
        />
        <Route path="/login" element={<LogIn />} />
        <Route path="/game">
          <Route path=":levelId" element={<Game />} />
        </Route>
        <Route path="/user">
          <Route path=":userId" element={<UserInfo />} />
        </Route>
        <Route path="/browse" element={<LevelBrowse />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
