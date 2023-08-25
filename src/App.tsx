import { Routes, Route } from "react-router";
import "./App.css";
import { Game } from "./components/Game/Game";
import { LogIn } from "./components/LogIn/LogIn";
import { LevelBrowse } from "./components/LevelBrowse/LevelBrowse";
import { AuthProvider } from "./components/AuthProvider";
import { NavBar } from "./components/NavBar/NavBar";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { CreateAccount } from "./components/CreateAccount/CreateAccount";
import { HomePage } from "./components/HomePage/HomePage";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <div className="mobile-warning">
        Sorry, but mobile devices are not currently supported. Check back in the
        future!
      </div>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
      </div>
    </AuthProvider>
  );
}

export default App;
