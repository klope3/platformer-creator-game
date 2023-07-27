import { Routes, Route } from "react-router";
import "./App.css";
import { Game } from "./Game";
import { LogIn } from "./components/LogIn/LogIn";
import { LevelBrowse } from "./components/LevelBrowse/LevelBrowse";
import { AuthProvider } from "./components/AuthProvider";
import { NavBar } from "./components/NavBar/NavBar";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { CreateAccount } from "./components/CreateAccount/CreateAccount";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<div>This is the home page</div>} />
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
