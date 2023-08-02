import { Routes, Route } from "react-router";
import "./App.css";
import { Game } from "./Game";
import { LogIn } from "./components/LogIn/LogIn";
import { LevelBrowse } from "./components/LevelBrowse/LevelBrowse";
import { AuthProvider } from "./components/AuthProvider";
import { NavBar } from "./components/NavBar/NavBar";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { CreateAccount } from "./components/CreateAccount/CreateAccount";
import { StarRating } from "./components/StarRating/StarRating";

function App() {
  function clickRating(rating: number) {
    console.log(rating);
  }
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={<StarRating heightPx={40} onClick={clickRating} />}
        />
        <Route path="/login" element={<LogIn />} />
        <Route path="/createAccount" element={<CreateAccount />} />
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
