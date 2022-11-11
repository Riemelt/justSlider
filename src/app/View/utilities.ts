import { Direction, Orientation } from "../types";

function convertViewPositionToModel(options: {
  position:    number,
  shift:       number,
  length:      number,
  min:         number,
  max:         number,
  orientation: Orientation,
  direction:   Direction,
}): number {
  const { position, shift, length, min, max, orientation, direction } = options;

  const ratio        = (max - min) / length;
  const realPosition = position - shift;
  const converted    = realPosition * ratio + min;

  if ((direction === "forward" && orientation === "horizontal") || (direction === "backward" && orientation === "vertical")) {
    return converted;
  }

  return min + max - converted;
}

function transform(options: {
  shift:       number,
  min:         number,
  max:         number,
  orientation: Orientation,
  direction:   Direction,
  scale?:      number,
}): string {
  const { shift, min, max, orientation, direction, scale } = options;

  const axis = getAxis(orientation);

  const translateValue = getTranslateValue(shift, min, max, orientation, direction);
  const translateStyle = getTranslateStyle(translateValue, axis);

  let result = translateStyle;

  if (scale !== undefined) {
    const scaleStyle = getScaleStyle(scale, axis);
    result += ` ${scaleStyle}`;
  }

  return result;
}

function getAxis(orientation: Orientation): string {
  return orientation === "horizontal" ? "X" : "Y";
}

function getPercentage(value: number, min: number, max: number): number {
  return Math.abs((((value - min) / (max - min)) * 100))
}

function getScaleStyle(scale: number, axis: string): string {
  return `scale${axis}(${scale})`;
}

function getTranslateStyle(translateValue: number, axis: string): string {
  return `translate${axis}(${translateValue}%)`;
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
  transform,
  convertViewPositionToModel,
};