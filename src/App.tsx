import { Routes, Route } from "react-router";
import "./App.css";
import { Game } from "./Game";
import { Link } from "react-router-dom";
import { LogIn } from "./components/LogIn/LogIn";
import { LevelBrowse } from "./components/LevelBrowse/LevelBrowse";
import { AuthProvider } from "./components/AuthProvider";
import { NavBar } from "./components/NavBar/NavBar";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Link to="/game">Game</Link>
              <Link to="/login">Log In</Link>
            </div>
          }
        />
        <Route path="/login" element={<LogIn />} />
        <Route path="/game" element={<Game />} />
        <Route path="/browse" element={<LevelBrowse />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
