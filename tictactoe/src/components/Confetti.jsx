export default function Confetti({ pieces }) {
  // Purely presentational: App.jsx generates the random piece data inside
  // its win-detection effect (a legitimate place for a side effect) and
  // hands it down here as plain props — nothing impure happens during render.
  if (!pieces || pieces.length === 0) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti__piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            '--drift': `${p.drift}px`,
            '--rotate': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
