// src/GameBoard.jsx
import React from "react";

import "./index.css";

const GameBoard = ({ board }) => {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`board-cell ${cell === "snake" ? "snake-cell" : ""} ${
                cell === "food" ? "food-cell" : ""
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
