export default function Scoreboard({ scores, players, onResetScores }) {
  return (
    <div className="scoreboard">
      <div className="scoreboard__row">
        <div className="scoreboard__item scoreboard__item--x">
          <span className="scoreboard__label">{players.X}</span>
          {/* key={scores.X} remounts the number on every change, replaying the bump animation */}
          <span key={scores.X} className="scoreboard__value">
            {scores.X}
          </span>
        </div>
        <div className="scoreboard__item">
          <span className="scoreboard__label">Draws</span>
          <span key={scores.draws} className="scoreboard__value">
            {scores.draws}
          </span>
        </div>
        <div className="scoreboard__item scoreboard__item--o">
          <span className="scoreboard__label">{players.O}</span>
          <span key={scores.O} className="scoreboard__value">
            {scores.O}
          </span>
        </div>
      </div>
      <button className="link-button" onClick={onResetScores}>
        Reset scoreboard
      </button>
    </div>
  );
}
