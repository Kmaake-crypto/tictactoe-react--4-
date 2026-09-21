import { useState } from 'react';
import Square from './Square';
import WinningLine from './WinningLine';
import { playMove, playInvalid } from '../utils/sound';

export default function Board({ squares, onSquareClick, winningLine, gameOver, xIsNext }) {
  const [shakeIndex, setShakeIndex] = useState(null);

  const handleClick = (i) => {
    const locked = gameOver || Boolean(squares[i]);

    if (locked) {
      playInvalid();
      setShakeIndex(i);
      window.setTimeout(() => setShakeIndex((current) => (current === i ? null : current)), 320);
      return;
    }

    playMove(xIsNext ? 'X' : 'O');
    onSquareClick(i);
  };

  return (
    <div className="board-stage">
      <div className="board-wrap">
        <div className="board" role="grid" aria-label="Tic Tac Toe board">
          {squares.map((value, i) => (
            <Square
              key={i}
              value={value}
              onClick={() => handleClick(i)}
              isWinning={winningLine?.includes(i)}
              isShaking={shakeIndex === i}
              locked={gameOver || Boolean(value)}
            />
          ))}
        </div>
        {winningLine && <WinningLine line={winningLine} />}
      </div>
    </div>
  );
}
