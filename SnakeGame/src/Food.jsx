import React from "react";

const Food = ({ position }) => {
  return (
    <div
      className="food"
      style={{
        left: `${position.x * 10}px`,
        top: `${position.y * 10}px`,
      }}
    ></div>
  );
};

export default Food;
