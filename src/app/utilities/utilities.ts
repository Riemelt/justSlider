import {
  Orientation,
  Direction,
} from '../types';
import {
  BACKWARD,
  FORWARD,
  HORIZONTAL,
  VERTICAL,
} from '../Model/constants';

interface Rect {
  x: number,
  y: number,
  w: number,
  h: number,
}

const convertViewPositionToModel = function (options: {
  position: number,
  shift: number,
  length: number,
  min: number,
  max: number,
  orientation: Orientation,
  direction: Direction,
}): number {
  const { position, shift, length, min, max, orientation, direction } = options;

  const ratio = (max - min) / length;
  const realPosition = position - shift;
  const converted = (realPosition * ratio) + min;

  if (shouldFlip(direction, orientation)) {
    return min + max - converted;
  }

  return converted;
};

const shouldFlip = function shouldFlip(
  direction: Direction,
  orientation: Orientation
): boolean {
  return (direction === BACKWARD && orientation === HORIZONTAL)
    || (direction === FORWARD && orientation === VERTICAL);
};

const getPositionStyles = function getPositionStyles(options: {
  shift: number,
  min: number,
  max: number,
  orientation: Orientation,
  direction: Direction,
}): {
  property: string,
  style: string,
} {
  const { shift, min, max, orientation, direction } = options;

  const positionValue = getPositionValue(shift, min, max, direction);
  const style = `${positionValue}%`;

  const property = orientation === HORIZONTAL ? 'left' : 'bottom';

  return {
    property,
    style,
  };
};

const getTransformStyles = function getTransformStyles(options: {
  shift: number,
  min: number,
  max: number,
  orientation: Orientation,
  direction: Direction,
  scale?: number,
}): {
  property: string,
  style: string,
} {
  const { shift, min, max, orientation, direction, scale } = options;

  const axis = getAxis(orientation);

  const translateValue = getTranslateValue(
    shift,
    min,
    max,
    orientation,
    direction
  );

  const translateStyle = getTranslateStyle(translateValue, axis);

  let result = translateStyle;

  if (scale !== undefined) {
    const scaleStyle = getScaleStyle(scale, axis);
    result += ` ${scaleStyle}`;
  }

  return {
    property: 'transform',
    style: result,
  };
};

const getPositionValue = function getPositionValue(
  shift: number,
  min: number,
  max: number,
  direction: Direction
): number {
  const percentage = getPercentage(shift, min, max);

  if (direction === BACKWARD) {
    return (100 - percentage);
  }

  return percentage;
};

const getAxis = function getAxis(orientation: Orientation): string {
  return orientation === HORIZONTAL ? 'X' : 'Y';
};

const getPercentage = function getPercentage(
  value: number,
  min: number,
  max: number
): number {
  return Math.abs((((value - min) / (max - min)) * 100));
};

const getScaleStyle = function getScaleStyle(
  scale: number,
  axis: string
): string {
  return `scale${axis}(${scale})`;
};

const getTranslateStyle = function getTranslateStyle(
  translateValue: number,
  axis: string
): string {
  return `translate${axis}(${translateValue}%)`;
};

const getTranslateValue = function getTranslateValue(
  shift: number,
  min: number,
  max: number,
  orientation: Orientation,
  direction: Direction
): number {
  const sign = orientation === HORIZONTAL ? (-1) : 1;
  const percentage = getPercentage(shift, min, max);

  if (direction === FORWARD) {
    return (100 - percentage) * sign;
  }

  return percentage * sign;
};

const getValueBasedOnPrecision = function getValueBasedOnPrecision(
  value: number,
  precision: number
): string {
  return value.toFixed(precision);
};

const getElementLength = function getElementLength(
  element: JQuery<HTMLElement>,
  orientation: Orientation,
): number {
  const length = orientation === HORIZONTAL ?
    element.outerWidth() :
    element.outerHeight();

  return length ?? 0;
};

const getElementPos = function getElementPos(
  element: JQuery<HTMLElement>,
  orientation: Orientation,
): number {
  const pos = orientation === HORIZONTAL ?
    element.offset()?.left :
    element.offset()?.top;

  return pos ?? 0;
};

const collision2d = function collision2d(rect1: Rect, rect2: Rect) {
  return rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y;
};

const convertToRect = function convertToRect(
  $element: JQuery<HTMLElement>
): Rect {
  const offset = $element.offset();

  return {
    x: offset?.left ?? 0,
    y: offset?.top ?? 0,
    w: $element.outerWidth() ?? 0,
    h: $element.outerHeight() ?? 0,
  };
};

const checkCollision = function checkCollision(
  $element1: JQuery<HTMLElement>,
  $element2: JQuery<HTMLElement>,
) {
  return collision2d(
    convertToRect($element1),
    convertToRect($element2),
  );
};

export {
  getTransformStyles,
  getPositionStyles,
  convertViewPositionToModel,
  getValueBasedOnPrecision,
  shouldFlip,
  getElementLength,
  getElementPos,
  checkCollision,
};
