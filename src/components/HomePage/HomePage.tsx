import { Link } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-page">
      <img className="hero" src="/assets/hero.png" alt="" />
      <div>
        <Link className="pixel-font bump-med" to="/browse">
          {"START >>>"}
        </Link>
      </div>
    </div>
  );
}
