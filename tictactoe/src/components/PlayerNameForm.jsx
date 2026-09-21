export default function PlayerNameForm({ players, onNameChange, disabled }) {
  return (
    <div className="name-form">
      <label className="name-form__field name-form__field--x">
        <span>X</span>
        <input
          type="text"
          value={players.X}
          maxLength={16}
          disabled={disabled}
          onChange={(e) => onNameChange('X', e.target.value)}
          aria-label="Player X name"
        />
      </label>
      <label className="name-form__field name-form__field--o">
        <span>O</span>
        <input
          type="text"
          value={players.O}
          maxLength={16}
          disabled={disabled}
          onChange={(e) => onNameChange('O', e.target.value)}
          aria-label="Player O name"
        />
      </label>
    </div>
  );
}
