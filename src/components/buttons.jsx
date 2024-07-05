import React from "react";
import { animated } from "@react-spring/web";
import { ReactComponent as ChevronLeft } from "../assets/left.svg";
import { ReactComponent as ChevronRight } from "../assets/right.svg";

export default function Button({ onClick, title, left, fade, style }) {
  return (
    <animated.div
      className={`button ${left ? "left" : "right"}`}
      style={{ opacity: fade ? 0.4 : 1, ...style }}
      onClick={onClick}
    >
      {left ? <ChevronLeft /> : <ChevronRight />}
    </animated.div>
  );
}
