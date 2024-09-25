import React from "react";

const Snake = ({ position }) => {
  return (
    <div
      className="snake-segment"
      style={{
        left: `${position.x * 10}px`,
        top: `${position.y * 10}px`,
      }}
    ></div>
  );
};

export default Snake;
