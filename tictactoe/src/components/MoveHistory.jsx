function describeMove(prevBoard, board, moveIndex) {
  const row = Math.floor(moveIndex / 3) + 1;
  const col = (moveIndex % 3) + 1;
  const symbol = board[moveIndex];
  return `${symbol} → row ${row}, col ${col}`;
}

export default function MoveHistory({ history, stepNumber, onJumpTo }) {
  return (
    <div className="history">
      <h2 className="history__title">Move history</h2>
      <ol className="history__list">
        <li>
          <button
            className={`history__item${stepNumber === 0 ? ' history__item--active' : ''}`}
            onClick={() => onJumpTo(0)}
          >
            Game start
          </button>
        </li>
        {history.slice(1).map((board, i) => {
          const step = i + 1;
          const label = describeMove(history[i], board, board.findIndex((v, idx) => v !== history[i][idx]));
          return (
            <li key={step}>
              <button
                className={`history__item${stepNumber === step ? ' history__item--active' : ''}`}
                onClick={() => onJumpTo(step)}
              >
                Move #{step} — {label}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
