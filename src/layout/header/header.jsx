import React, { useEffect } from "react";
import "./header.scss";
import logo from "../../assets/logo.svg";
import { animated, to, useSpring } from "@react-spring/web";
import BezierEasing from "bezier-easing";

export const customEasing = BezierEasing(1.0, -0.135, 0.01, 1.065);
export default function Header({ details }) {
  const [draw, detailsApi] = useSpring(() => ({
    from: { x: 0, y: 0, scale: 1, scaleArrow: 1 },
  }));

  useEffect(() => {
    detailsApi.start({
      y: details ? -100 : 0,
      scale: details ? 1.5 : 1,
      config: {
        duration: 2000,
        easing: (t) => customEasing(t),
      },
    });
  }, [details, detailsApi]);
  return (
    <animated.div
      className="header"
      style={{
        transform: to(
          [draw.x, draw.y, draw.scale],
          (x, y, scale) =>
            `translate3d(${x}px, calc(${y * 1.3}px + ${
              y * 0.11
            }vw ), 0) scale(${scale})`
        ),
      }}
    >
      <div className="logo">
        <img src={logo} alt="logo" width="80" height="18" />
      </div>
      <div className="menu">
        <span>Home</span>
        <span>Electric cars</span>
        <span>Sport cars</span>
        <span>SUV</span>
      </div>
      <div className="profile">
        <div className="avatar">
          <img
            src="https://i.pravatar.cc/150?img=42"
            alt="avatar"
            width="35"
            height="35"
          />
        </div>
        <span>My Account</span>
      </div>
    </animated.div>
  );
}
