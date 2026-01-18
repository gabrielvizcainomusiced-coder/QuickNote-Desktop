import React from "react";

function BoltIcon({ size = 18 }) {
  return (
    <span className="bolt-icon">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    </span>
  );
}

export default BoltIcon;