import React from "react";
import { ReactComponent as ChevronLeft } from "../assets/left.svg";
import { ReactComponent as ChevronRight } from "../assets/right.svg";

export default function Button({ onClick, title, left, fade }) {
  return (
    <div
      className="button"
      style={{ opacity: fade ? 0.4 : 1 }}
      onClick={onClick}
    >
      {left ? <ChevronLeft /> : <ChevronRight />}
    </div>
  );
}
