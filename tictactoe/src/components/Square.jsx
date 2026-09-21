export default function Square({ value, onClick, isWinning, isShaking, locked }) {
  return (
    <button
      type="button"
      className={
        'square' +
        (locked ? ' square--locked' : '') +
        (isWinning ? ' square--winning' : '') +
        (isShaking ? ' square--shake' : '') +
        (value ? ` square-${value}` : '')
      }
      onClick={onClick}
      aria-disabled={locked}
      aria-label={value ? `Square filled with ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
}
