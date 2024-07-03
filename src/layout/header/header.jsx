import React from "react";
import "./header.scss";
import logo from "../../assets/logo.svg";

export default function Header() {
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="menu">
        <span>Home</span>
        <span>Electric cars</span>
        <span>Sport cars</span>
        <span>SUV</span>
      </div>
      <div className="profile">
        <div className="avatar">
          <img src="https://i.pravatar.cc/150?img=42" alt="avatar" />
        </div>
        <span>My Account</span>
      </div>
    </div>
  );
}
