type Orientation = "vertical" | "horizontal";
type Direction   = "forward" | "backward";

interface Options {
  from?:        number;
  to?:          number;
  step?:        number;
  min?:         number;
  max?:         number;
  isRange?:     boolean;
  orientation?: Orientation;
  direction?:   Direction;
}

interface TransformOptions {
  shift:       number;
  min:         number;
  max:         number;
  orientation: Orientation;
  direction:   Direction;
  scale?:      number;
}