// All 8 possible winning lines on a 3x3 board
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

/**
 * Given a 9-cell board array, returns:
 *  - { winner: 'X' | 'O', line: [a,b,c] }  if there's a winner
 *  - null                                   if no winner yet
 */
export function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/** True when every cell is filled and nobody has won. */
export function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}
