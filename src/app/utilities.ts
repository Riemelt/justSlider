function translate(shift: number, min: number, max: number, orientation: Orientation, direction: Direction): string {
  const axis = orientation === "horizontal" ? "X" : "Y";
  const valueToTranslate = getTranslateValue(shift, min, max, orientation, direction);

  return `translate${axis}(${valueToTranslate}%)`;
}

function getPercentage(value: number, min: number, max: number): number {
  return Math.abs((((value - min) / (max - min)) * 100))
}

function getTranslateValue(shift: number, min: number, max: number, orientation: Orientation, direction: Direction): number {
  const sign = orientation === "horizontal" ? (-1) : 1;
  const percentage = getPercentage(shift, min, max);

  if (direction === "forward") {
    return (100 - percentage) * sign;
  }

  return percentage * sign;
}

export {
  translate,
  getPercentage,
};