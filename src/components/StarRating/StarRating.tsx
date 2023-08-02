import { useState } from "react";
import { uiPaths } from "../../assetPaths";

type StarRatingProps = {
  heightPx: number;
  onClick: (clickedRating: number) => void;
};

export function StarRating({ heightPx, onClick }: StarRatingProps) {
  const [rating, setRating] = useState(0.5);
  // const heightPx = 40;

  function chooseOffset(starIndex: number) {
    const difference = rating - starIndex;
    if (difference > 0.5) return 0;
    else if (difference === 0.5) return 50;
    else return 100;
  }

  function mouseEnterHoverRegion(regionIndex: number) {
    setRating((regionIndex + 1) / 2);
  }

  function mouseLeaveHoverRegion() {
    // console.log("leave");
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              backgroundImage: `url("${uiPaths.stars}")`,
              width: `${heightPx * 1.05}px`,
              height: `${heightPx}px`,
              backgroundSize: "cover",
              backgroundPositionX: `${chooseOffset(i)}%`,
            }}
          ></div>
        ))}
      </div>
      <div style={{ display: "flex", position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "transparent",
              width: `${heightPx * 0.5 * 1.05}px`,
              height: `${heightPx}px`,
              cursor: "pointer",
            }}
            onMouseEnter={() => mouseEnterHoverRegion(i)}
            onMouseLeave={mouseLeaveHoverRegion}
          ></div>
        ))}
      </div>
    </div>
  );
}
