// Center-point coordinates (in %) for each of the 9 cells in a 3x3 grid
const CENTERS = [
  [16.6, 16.6], [50, 16.6], [83.3, 16.6],
  [16.6, 50], [50, 50], [83.3, 50],
  [16.6, 83.3], [50, 83.3], [83.3, 83.3],
];

export default function WinningLine({ line }) {
  const [start, , end] = line;
  const [x1, y1] = CENTERS[start];
  const [x2, y2] = CENTERS[end];

  return (
    <svg className="winning-line" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="winning-line__stroke" />
    </svg>
  );
}
