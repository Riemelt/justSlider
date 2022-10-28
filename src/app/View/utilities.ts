import { Direction, Orientation } from "../types";
import { ConvertPositionOptions, TransformOptions } from "./types";

function convertViewPositionToModel({position, $context, min, max, orientation, direction}: ConvertPositionOptions): number {
  const sliderLength = orientation === "horizontal" ? $context.width() : $context.height();
  const shift        = orientation === "horizontal" ? $context.position().left : $context.position().top;

  const ratio        = (max - min) / sliderLength;
  const realPosition = position - shift;
  const converted    = realPosition * ratio + min;

  if ((direction === "forward" && orientation === "horizontal") || (direction === "backward" && orientation === "vertical")) {
    return converted;
  }

  return min + max - converted;
}

function transform({shift, min, max, orientation, direction, scale}: TransformOptions): string {
  const axis = getAxis(orientation);

  const translateValue = getTranslateValue(shift, min, max, orientation, direction);
  const translateStyle = getTranslateStyle(translateValue, axis);

  const scaleStyle = scale !== undefined ? getScaleStyle(scale, axis) : "";

  return `${translateStyle} ${scaleStyle}`;
}

function getAxis(orientation: Orientation): string {
  return orientation === "horizontal" ? "X" : "Y";
}

function getPercentage(value: number, min: number, max: number): number {
  return Math.abs((((value - min) / (max - min)) * 100))
}

function getScaleStyle(scale: number, axis: string) {
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