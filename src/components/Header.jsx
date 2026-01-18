import React from "react";
import BoltIcon from "./BoltIcon";

function Header() {
  return (
    <header className="app-header">
      <h1 className="logo">
        Quick
        <BoltIcon />
        Note
      </h1>
    </header>
  );
}

export default Header;
