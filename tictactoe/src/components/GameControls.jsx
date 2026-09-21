export default function GameControls({ onRestart, onUndo, canUndo }) {
  return (
    <div className="controls">
      <button className="btn btn--ghost" onClick={onUndo} disabled={!canUndo}>
        ⏪ Undo
      </button>
      <button className="btn btn--primary" onClick={onRestart}>
        ↻ Restart
      </button>
    </div>
  );
}
