import React, { useState, useEffect, useCallback } from "react";
import GameBoard from "./GameBoard";
import "./index.css";
import ScoreIcon from "@mui/icons-material/Score";
import StarIcon from "@mui/icons-material/Star";

const initialSnake = [{ x: 10, y: 10 }];
const boardSize = 20;

const App = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [board, setBoard] = useState(createInitialBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem("bestScore")) || 0
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [lastDirection, setLastDirection] = useState({ x: 1, y: 0 });
  const [keyPressed, setKeyPressed] = useState(false);

  function createInitialBoard() {
    return Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  }

  const generateFoodPosition = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      };
    } while (isCollisionWithSnake(newFood));
    setFood(newFood);
  }, [snake]);

  const isCollisionWithSnake = (position) => {
    return snake.some(
      (segment) => segment.x === position.x && segment.y === position.y
    );
  };

  useEffect(() => {
    const updatedBoard = createInitialBoard();
    snake.forEach((segment) => {
      updatedBoard[segment.y][segment.x] = "snake";
    });

    if (gameStarted && food) {
      updatedBoard[food.y][food.x] = "food";
    }

    setBoard(updatedBoard);
  }, [snake, food, gameStarted]);

  const moveSnake = () => {
    if (!gameStarted) return;

    const newSnake = [...snake];
    const head = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y,
    };

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= boardSize ||
      head.y >= boardSize ||
      isCollisionWithSnake(head)
    ) {
      console.log("Game Over");
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem("bestScore", score);
      }
      resetGame();
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      generateFoodPosition();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    setKeyPressed(false);
  };

  const resetGame = () => {
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    setLastDirection({ x: 1, y: 0 });
    setScore(0);
    setFood(null);
    setGameStarted(false);
    setKeyPressed(false);
  };

  useEffect(() => {
    const interval = setInterval(moveSnake, 180);
    return () => clearInterval(interval);
  }, [snake, direction, food, score, bestScore, gameStarted]);

  const handleKeyDown = (e) => {
    if (keyPressed) return;

    if (!gameStarted) {
      setGameStarted(true);
      generateFoodPosition();
    }

    let newDirection;

    switch (e.key) {
      case "ArrowUp":
        if (lastDirection.y === 0) {
          newDirection = { x: 0, y: -1 };
        }
        break;
      case "ArrowDown":
        if (lastDirection.y === 0) {
          newDirection = { x: 0, y: 1 };
        }
        break;
      case "ArrowLeft":
        if (lastDirection.x === 0) {
          newDirection = { x: -1, y: 0 };
        }
        break;
      case "ArrowRight":
        if (lastDirection.x === 0) {
          newDirection = { x: 1, y: 0 };
        }
        break;
      default:
        return;
    }

    if (newDirection) {
      setDirection(newDirection);
      setLastDirection(newDirection);
      setKeyPressed(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, gameStarted, keyPressed]);

  return (
    <div className="App">
      <div className="scoreboard">
        <div className="score">
          <ScoreIcon style={{ color: "#fecd45" }} />
          <span>Score: {score}</span>
        </div>
        <div className="best-score">
          <StarIcon style={{ color: "#fecd45" }} />
          <span>Best Score: {bestScore}</span>
        </div>
      </div>
      <GameBoard board={board} />
    </div>
  );
};

export default App;
