export default function StatusBar({ winner, draw, nextPlayerName, nextPlayerSymbol }) {
  let text;
  let tone = 'playing';

  if (winner) {
    text = `${winner.name} wins! 🎉`;
    tone = 'winner';
  } else if (draw) {
    text = "It's a draw!";
    tone = 'draw';
  } else {
    text = `${nextPlayerName}'s turn`;
  }

  return (
    <div className={`status status--${tone}`}>
      {!winner && !draw && <span className={`status__dot status__dot--${nextPlayerSymbol}`} />}
      {/* key={text} forces a remount whenever the message changes, replaying the fade-in */}
      <span key={text} className="status__text">
        {text}
      </span>
    </div>
  );
}
