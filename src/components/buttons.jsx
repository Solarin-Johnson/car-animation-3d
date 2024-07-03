import React from "react";

export default function Button({ onClick, title }) {
  return (
    <div className="button" onClick={onClick}>
      {title}
    </div>
  );
}
