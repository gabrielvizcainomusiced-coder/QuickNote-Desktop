import React from "react";
import BoltIcon from "./BoltIcon";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <span className="footer-content">
        © {year} <BoltIcon /> Gabriel Vizcaino
      </span>
    </footer>
  );
}

export default Footer;