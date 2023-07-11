import { Routes, Route } from "react-router";
import "./App.css";
import { Game } from "./Game";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Link to="/game">Game</Link>
              <div>Llamas</div>
            </div>
          }
        />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;
