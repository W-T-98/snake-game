import { useEffect, useRef, useState } from "react";

const BOARD_SIZE = 20;
const SCALE = 20;
const SPEED = 150;

export default function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [dir, setDir] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") setDir([0, -1]);
      if (e.key === "ArrowDown") setDir([0, 1]);
      if (e.key === "ArrowLeft") setDir([-1, 0]);
      if (e.key === "ArrowRight") setDir([1, 0]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#22c55e"; // green-500
    snake.forEach(([x, y]) =>
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
    );

    ctx.fillStyle = "#ef4444"; // red-500
    ctx.fillRect(food[0] * SCALE, food[1] * SCALE, SCALE, SCALE);
  }, [snake, food]);

  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = newSnake[0];
    const newHead = [head[0] + dir[0], head[1] + dir[1]];

    if (
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= BOARD_SIZE ||
      newHead[1] >= BOARD_SIZE ||
      newSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(newHead);

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ]);
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
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
      <h2 className="text-2xl font-bold">🐍 Snake Game</h2>

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
            Restart
          </button>
        </div>
      )}
    </div>
  );
}