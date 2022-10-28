import { Direction, Orientation } from "../types";

interface TransformOptions {
  shift:       number;
  min:         number;
  max:         number;
  orientation: Orientation;
  direction:   Direction;
  scale?:      number;
}

interface ConvertPositionOptions {
  position:    number;
  $context:    JQuery<HTMLElement>;
  min:         number;
  max:         number;
  orientation: Orientation;
  direction:   Direction;
}

export {
  TransformOptions,
  ConvertPositionOptions,
}