import { useEffect } from "react";
import "./spec.scss";
import { animated, useSpring } from "@react-spring/web";
import { customEasing } from "../header/header";
import image1 from "../../assets/views/image01.png";
import image2 from "../../assets/views/image02.png";
import image3 from "../../assets/views/image03.png";
import image4 from "../../assets/views/image04.png";

const viewSrc = [image1, image2, image3, image4];

export function BottomView({ details }) {
  const [draw, api] = useSpring(() => ({
    from: { x: 0, y: 10, opacity: 0 },
  }));

  useEffect(() => {
    api.start({
      y: details ? -40 : 0,
      scale: details ? 1 : 0,
      opacity: details ? 1 : 0,
      config: {
        duration: 2000,
        easing: (t) => customEasing(t),
      },
    });
  }, [details, api]);
  return (
    <animated.div
      style={{
        transform: draw.y.to(
          (y) => `translate3d(0, calc(${y * 1.8}% + ${y}px), 0)`
        ),
        opacity: draw.scale,
      }}
      className="view"
    >
      <div className="title">Take a look</div>
      <div className="body">
        {viewSrc.map((src, index) => (
          <span>
            <img
              key={index}
              src={src}
              alt={`view ${index}`}
              className="view-image"
            />
          </span>
        ))}
      </div>
    </animated.div>
  );
}
