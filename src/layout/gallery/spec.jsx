import { useEffect, useState } from "react";
import "./spec.scss";
import { animated, to, useSpring } from "@react-spring/web";
import { customEasing } from "../header/header";
import { colors } from "../gallery/index";
import { ReactComponent as Fuel } from "../../assets/icons/fuel.svg";
import { ReactComponent as Seat } from "../../assets/icons/seat.svg";
import { ReactComponent as Engine } from "../../assets/icons/engine.svg";
import { publicViewImage } from "../../utils";

const viewSrc = [
  publicViewImage("image01.webp"),
  publicViewImage("image02.webp"),
  publicViewImage("image03.webp"),
  publicViewImage("image04.webp"),
];
const specs = [
  {
    icon: Fuel,
    value: "800km",
    type: "Gas",
  },
  {
    icon: Seat,
    value: "4",
    type: "Seats",
  },
  {
    icon: Engine,
    value: "335",
    type: "Horse power",
  },
];

export function BottomView({ details, index }) {
  const [btnColor, setBtnColor] = useState();
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

  useEffect(() => {
    const getColor = [...colors].reverse();
    console.log("color", getColor[index]);
    setBtnColor(getColor[index + 1]);
  }, [index]);
  return (
    <animated.div
      style={{
        transform: draw.y.to(
          (y) => `translate3d(0, calc(${y * 2.2}% - ${y}px - 1.4vw), 0)`
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
      <div className="button" style={{ backgroundColor: btnColor }}>
        Rent Now
      </div>
    </animated.div>
  );
}

export const RightView = ({ details, windowWidth }) => {
  const [draw, api] = useSpring(() => ({
    from: { x: 200, y: 0, opacity: 0 },
  }));

  useEffect(() => {
    api.start({
      x: details ? 0 : windowWidth > 1024 ? 200 : 0,
      y: details ? 0 : windowWidth > 1024 ? 0 : -40,
      opacity: details ? 1 : 0,
      delay: details ? 1000 : 0,
      config: {
        duration: 2000,
        easing: (t) => customEasing(t),
      },
    });
  }, [details, api, windowWidth]);

  return (
    <animated.div
      style={{
        transform: to(
          [draw.x, draw.y],
          (x, y) => `translate3d(calc(${x * 2.2}% - ${x}px), ${y}vw, 0)`
        ),
        opacity: draw.opacity,
      }}
      className="specs"
    >
      <div className="title">specs</div>
      <div className="body">
        {specs.map((spec, index) => (
          <div key={index} className="spec">
            <spec.icon />
            <div className="value">{spec.value}</div>
            <div className="type">{spec.type}</div>
          </div>
        ))}
      </div>
    </animated.div>
  );
};
