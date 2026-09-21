const COLORS = ['var(--chalk-yellow)', 'var(--chalk-blue)', 'var(--chalk-white)', 'var(--chalk-red)'];

export function createConfettiBurst(id, count = 26) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${id}-${i}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    duration: 1 + Math.random() * 0.6,
    rotate: Math.round(Math.random() * 360),
    drift: Math.round((Math.random() - 0.5) * 80),
    color: COLORS[i % COLORS.length],
  }));
}
