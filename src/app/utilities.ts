function getPercentage(value: number, min: number, max: number): number {
  return Math.abs((((value - min) / (max - min)) * 100))
}

export {
  getPercentage,
};