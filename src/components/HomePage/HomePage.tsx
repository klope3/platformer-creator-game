import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-page">
      <img className="hero" src="/assets/hero.png" alt="" />
      <div>
        <a className="pixel-font bump-med" href="/browse">
          {"START >>>"}
        </a>
      </div>
    </div>
  );
}
