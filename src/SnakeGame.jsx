import { useEffect, useRef, useState } from "react";

const BOARD_SIZE = 20;
const SCALE = 20;
const SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [dir, setDir] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [passThroughMode, setPassThroughMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === "w") setDir([0, -1]);
      if (key === "s") setDir([0, 1]);
      if (key === "a") setDir([-1, 0]);
      if (key === "d") setDir([1, 0]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = "#d1d5db"; // gray-300
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x <= BOARD_SIZE; x++) {
      ctx.beginPath();
      ctx.moveTo(x * SCALE, 0);
      ctx.lineTo(x * SCALE, BOARD_SIZE * SCALE);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= BOARD_SIZE; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * SCALE);
      ctx.lineTo(BOARD_SIZE * SCALE, y * SCALE);
      ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = "#22c55e"; // green-500
    snake.forEach(([x, y]) =>
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
    );

    // Draw food
    ctx.fillStyle = "#ef4444"; // red-500
    ctx.fillRect(food[0] * SCALE, food[1] * SCALE, SCALE, SCALE);
  }, [snake, food]);

  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = newSnake[0];
    let newHead = [head[0] + dir[0], head[1] + dir[1]];

    // Handle pass-through mode (wrap around) or walls mode (game over)
    if (passThroughMode) {
      // Wrap around the edges
      if (newHead[0] < 0) newHead[0] = BOARD_SIZE - 1;
      if (newHead[0] >= BOARD_SIZE) newHead[0] = 0;
      if (newHead[1] < 0) newHead[1] = BOARD_SIZE - 1;
      if (newHead[1] >= BOARD_SIZE) newHead[1] = 0;
    } else {
      // Walls mode - check for collisions
      if (
        newHead[0] < 0 ||
        newHead[1] < 0 ||
        newHead[0] >= BOARD_SIZE ||
        newHead[1] >= BOARD_SIZE
      ) {
        setGameOver(true);
        return;
      }
    }

    // Check for self-collision (applies to both modes)
    if (newSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(newHead);

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ]);
      setScore(score + 10);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const resetGame = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    setDir([0, -1]);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
      <h2 className="text-2xl font-bold">🐍 Snake Game</h2>
      <p className="text-xl font-semibold">Score: {score}</p>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">
          Mode: {passThroughMode ? "Pass-Through" : "Walls"}
        </span>
        <button
          onClick={() => setPassThroughMode(!passThroughMode)}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
        >
          {passThroughMode ? "Switch to Walls" : "Switch to Pass-Through"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={BOARD_SIZE * SCALE}
        height={BOARD_SIZE * SCALE}
        className="bg-gray-200 border-4 border-gray-700 rounded"
      />

      {gameOver && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-red-400 text-lg font-semibold">Game Over</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}
