export const parseBounds = (bounds: string) => {
  const matches = bounds.match(/\d+/g);
  if (!matches) {
    throw new Error(`Invalid bounds string: ${bounds}`);
  }
  const [left, top, right, bottom] = matches.map(Number);
  const x = Math.floor((left + right) / 2);
  const y = Math.floor((top + bottom) / 2);
  return { x, y };
};
